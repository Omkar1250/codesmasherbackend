const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true,
    },
    lastName:{
        type:String,
        required:true,
        trim:true,

    },
    email:{
        type:String,
        required:true,
    },
    password: {
        type: String,
        required: true,
    },
    token:{
        type:String,

    },
    resetPasswordExpires:{
        type:Date,
    },
    image:{
        type:String,
        reqired:true,
    },
    accountType:{
        type:String,
        enum:["Admin", "User"],
        required:true,
    },
    approved: {
        type: Boolean,
        default: true,
    },
    additionalDetails: {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: "Profile",
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
        },
    ],
    
});

module.exports = mongoose.model("User", userSchema)