const mongoose = require('mongoose');

const commentsSchema = new mongoose.Schema({
    commentDesc: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
       
        ref: "User",  // Usually model names are capitalized
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
     
        ref: "Post",
        index: true,
    },
});

module.exports = mongoose.model("Comments", commentsSchema);
