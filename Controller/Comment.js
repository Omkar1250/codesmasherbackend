const Comment = require('../Models/Comments');
const Post = require("../Models/Post")
const User = require("../Models/User")

exports.createComment = async(req, res) => {
    try {
        const userId = req.user.id;  // Authentication middleware must ensure req.user is populated
        const { commentDesc, post } = req.body;

        if (!commentDesc || !post) {
            return res.status(400).json({
                success: false,
                message: "Comment description and post ID are required"
            });
        }

        const userDetails = await User.findById(userId);
        if (!userDetails) {
            return res.status(401).json({
                success: false,
                message: "Authentication required to comment"
            });
        }

        const postDetails = await Post.findById(post);
        if (!postDetails) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        const comment = await Comment.create({ commentDesc, user: userId, post: post });
       const updatedpost = await Post.findByIdAndUpdate(post, { $push: { comments: comment._id } }, { new: true });
            console.log(updatedpost)
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
}
 