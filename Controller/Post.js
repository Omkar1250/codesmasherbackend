const Category = require("../Models/Category");
const Post = require("../Models/Post"); // Ensure correct casing and path for model
const User = require("../Models/User")
require('dotenv').config
const {uploadImageToCloudinary} = require("../utils/imageUploader")
exports.createPost = async (req, res) => {
    try {
        // Get user id from request object
        const userId = req.user.id;
        // Get all required fields from request body
        let { 
            title,
            body,  
            tag:_tag,
            category,
        } = req.body;

        // Get thumbnail from request files
        const thumbnail = req.files.thumbnailImage; // Access the correct field name

        console.log("Uploaded files:", req.files); // Log uploaded files
        console.log("Thumbnail file:", thumbnail); // Log thumbnail file

        // Convert tag from stringified array to Array
        const tag = JSON.parse(_tag);
 
        // Check if any of the required fields is missing 
        if (!title || !body  || !tag.length || !category) {
            return res.status(400).json({
                success: false,
                message: "All fields are mandatory"
            });
        }

        // Check if the user is admin
        const adminDetails = await User.findById(userId, { accountType: "Admin" });
        if (!adminDetails) {
            return res.status(404).json({
                success: false,
                message: "Admin details not found"
            });
        }

        // Check category
        const categoryDetails = await Category.findById(category);
        if (!categoryDetails) {
            return res.status(404).json({
                success: false,
                message: "Category details not found"
            });
        }
        
        //upload image to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(
            thumbnail,
            process.env.FOLDER_NAME
        );
        console.log("Thumbnail uploaded to Cloudinary:", thumbnailImage);

        // Create the new post with the above details
        const newPost = await Post.create({
            title,
            body, 
            author: adminDetails._id,
            tag,
            category: categoryDetails._id,
            thumbnail: thumbnailImage.secure_url,
        });

        // Add the post to the admin schema
        await User.findByIdAndUpdate(adminDetails._id, {
            $push: { posts: newPost._id }
        });

        // Update the category with the new post
        await Category.findByIdAndUpdate(category, {
            $push: { posts: newPost._id }
        });

        // Return success message if post created successfully
        res.status(200).json({
            success: true,
            message: "New post has been created successfully",
            data: newPost
        });
        
    } catch (error) {
        // Log the error for debugging purposes
        console.error("Error while creating post:", error);

        // Return appropriate error response
        return res.status(500).json({
            success: false,
            message: "Error while creating post",
            error: error.message
        });
    }
};

exports.getAllPosts = async (req, res) => {
    try {
        const allPost = await Post.find({},
            {
                                        title:true,
                                        body:true,
                                        thumbnail:true,
                                        author:true,
                                        comments:true,
                                        createdAt:true,
 
        })
                                  .populate("author", "name email")
                                  .populate("category") // Assuming 'name' and 'email' are fields in the 'author' document
                                  .exec();
        return res.json({ 
            success: true,
            message: "All posts fetched successfully",
            data: allPost
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Failed to fetch posts",
            error: error.message
        });
    }
}

exports.getPostDetails = async(req, res) => {
    try {
        const {postId} = req.body  // Assuming you use route parameter to pass post ID
        console.log(postId)
        const postDetails = await Post.findOne({
            _id:postId,
        })
            .populate({
                path:'comments',
                populate: {
                    path:'user',
                    select: 'firstName lastName image'
                }
            })
            .populate({
                path: 'author',
                select: 'firstName '  // Optionally limit the fields to return
            })
            .populate({
                path: 'category', 
                select: 'name'  // Optionally limit the fields to return
            }) 
            .exec();
    
        if (!postDetails) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Post details fetched successfully",
            data: postDetails  // Include the post details in the response
        });

    } catch (error) {
        console.error("Error fetching post details:", error);
        return res.status(500).json({
            success: false,
            message: "Error occurred while fetching post details",
            error: error.message
        });
    }
}


exports.editPost = async (req, res) => {
    try {
        const { postId } = req.body;
        const updates = req.body;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                error: "Post not found"
            });
        }

        if (req.files && req.files.thumbnailImage) {
            console.log("Thumbnail update");
            const thumbnail = req.files.thumbnailImage;
            const thumbnailImage = await uploadImageToCloudinary(
                thumbnail,
                process.env.FOLDER_NAME
            );
            post.thumbnail = thumbnailImage.secure_url;
        }

        // Update only the fields that are present in the request body
        for (const key in updates) {
            if (Object.prototype.hasOwnProperty.call(updates, key)) {
                if (key === "tag") {
                    post[key] = JSON.parse(updates[key]);
                } else if (key !== "postId") {
                    // Ensure that postId is not updated
                    post[key] = updates[key];
                }
            }
        }

        await post.save();

        const updatedPost = await Post.findOne({
            _id: postId,
        }).populate("category")
            .populate("comments")
            .exec();

        res.json({
            success: true,
            message: "Post updated successfully",
            data: updatedPost,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};


exports.deletePost = async (req, res) => {
    try {
       const {postId} = req.body
       const postDetails = await Post.findOne({
        _id: postId,
       })
       .populate("category")
       .populate("comments")
       .exec();

       if(!postDetails){
        return res.status(400).json({
            success: false,
            message: `Could not find post with id: ${postId}`,
          })
        }

        // Delete the post
        await Post.deleteOne({ _id: postId });

        // Respond with a success message
        res.json({ 
            success:true,
            message: "Post deleted successfully" });
    } catch (error) {
        // Log the error for debugging purposes
        console.error("Error while deleting post:", error);

        // Return a 500 Internal Server Error response with error details
        res.status(500).json({ message: "Error while deleting post", error: error.message });
    }
};
