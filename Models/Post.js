const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required:true,

    },
    body: {
        type:String,
        required:true,
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
      
        ref:"User",
    },
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comments"
        },

    ], 
    thumbnail:{
        type:String,
    }, 
    tag:{
        type:[String]
      
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },     
    

});

module.exports = mongoose.model("Post", postSchema)