const Profile = require("../Models/Profile");
const Post = require("../Controller/Post");
const User = require("../Models/User");
const mongoose = require('mongoose');
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.updateProfile = async(req, res) => {
    try {


        const {
            firstName="",
            lastName="",
            dateOfBirth="",
            about="",
            contactNumber="", 
            gender="" 
        } = req.body;
         const id = req.user.id;

   
        //find the profile by id
        const userDetails = await User.findById(id)
       
        const profile = await Profile.findById(userDetails.additionalDetails)
      


        const user = await User.findByIdAndUpdate(id, { 
            firstName, 
            lastName, 
        }) 
       

        await user.save();
            // Update the profile fields
    profile.dateOfBirth = dateOfBirth
    profile.about = about
    profile.contactNumber = contactNumber
    profile.gender = gender 
 
    // Save the updated profile
    await profile.save()

        //find the updated user details
        const updatedUserDetails = await User.findById(id)
        .populate("additionalDetails")
        .exec()

        return res.json({
            success:true,
            messasge:"Profile updated Successfully",
            updatedUserDetails,
        })

    } catch (error) {
 
        return res.status(500).json({
            success:false, 
            error:error.message,
        })
    }
}

exports.getProfileDetails = async(req, res) => {
    try {

        const id = req.user.id;
        const user = await User.findById(id)
        const allProfileDetails = await User.findById(id).populate('additionalDetails').exec()
        if(!allProfileDetails){
            return res.status(400).json({
                success:false,
                message:"Profile details not found, Something went wrong"
            })
        }

         return res.status(200).json({
            success:true,
            message:"Profile fetch Successfully",
            data:allProfileDetails
         }) 
    } catch (error) {
      
        return res.status(400).json({
            success:false,
            message:"Something went wrong while fetching post"
        })
    }
}


//update profile picture
exports.updateProfilePicture = async(req, res) => {
    try {
        const displayPicture = req.files.displayPicture;
        const id = req.user.id;
        const image = await uploadImageToCloudinary(
            displayPicture,
            process.env.FOLDER_NAME,
            1000,
            1000
        )

        const updateProfile = await User.findByIdAndUpdate(
            {_id: id},
            {image: image.secure_url},
            {new: true}
        )
        res.send({
            success: true,
            message: `Image Updated successfully`,
            data: updateProfile,
          })
        } catch (error) {
          return res.status(500).json({
            success: false,
            message: error.message,
          })
        }
      }

// delete user account
exports.deleteAccount = async(req, res) => {
    try {
        const id = req.user.id;
      

        const user = await User.findById({ _id: id})
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not found" 
            })
      
        }
          //Delete the user
         await User.findByIdAndDelete({_id: id})
         res.status(200).json({
            success:true,
            message:"User deleted successfully"
         })
    } catch (error) {
     
        return res.status(400).json({
            success:false,
            message:"User cannot be deleted, Something went wrong"
        })
        
    }
}

