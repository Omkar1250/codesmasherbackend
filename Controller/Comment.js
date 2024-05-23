const Comment = require('../Models/Comments');
const Post = require("../Models/Post")
const User = require("../Models/User")

exports.createComment = async (req, res) => {
    try {
        const userId = req.user.id;  // Ensure the authentication middleware populates req.user
        const { commentDesc, postId } = req.body;

        // Check if commentDesc and post are provided
        if (!commentDesc || !postId) {
            return res.status(400).json({
                success: false,
                message: "Comment description and post ID are required"
            });
        }

        // Fetch user details
        const userDetails = await User.findById(userId);
        if (!userDetails) {
            return res.status(401).json({
                success: false,
                message: "Authentication required to comment"
            });
        }

        // Fetch post details
        const postDetails = await Post.findById(postId);
        if (!postDetails) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        // Create comment
        const comment = await Comment.create({ commentDesc, user: userId, post: postId });

        // Update post with the new comment
        await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } }, { new: true });

        // Respond with success message and comment data
        res.status(200).json({
            success: true,
            message: "Comment created successfully",
            data: comment  
        });

    } catch (error) {
        console.error("Error creating comment:", error);
        return res.status(500).json({
            success: false,
            message: "Error creating comment",
            error: error.message
        });
    }
};