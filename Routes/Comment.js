const express = require('express');
const router = express.Router();

const { auth, isAdmin, isUser } = require("../middlewares/auth");
const { createComment } = require("../Controller/Comment");




// Routes for comments
router.post('/createcomment', auth, isUser, createComment);

module.exports = router