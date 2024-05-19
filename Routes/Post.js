const express = require('express');
const router = express.Router();

const { createPost, getAllPosts,getPostDetails, deletePost, editPost } = require("../Controller/Post");
const { createCategory, showAllCategories } = require('../Controller/Category');

const { auth, isAdmin, isUser } = require("../middlewares/auth");

// Routes for posts
router.post("/createpost", auth, isAdmin, createPost);
router.post("/getpostdetails", getPostDetails)
router.get("/getallposts", getAllPosts); // Corrected function name
router.delete("/deletepost",  deletePost);
router.post("/editpost",auth, isAdmin, editPost)

// Routes for categories
router.post("/createcategory", auth, isAdmin, createCategory); 
router.get("/showallcategory", showAllCategories);



module.exports = router;
 