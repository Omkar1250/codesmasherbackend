const express = require('express');
const router = express.Router();


const {updateProfile, deleteAccount, getProfileDetails,updateProfilePicture } = require("../Controller/Profile");
const {auth, isUser, isAdmin} = require('../middlewares/auth')

router.put("/updateprofile",auth, updateProfile)
router.get('/getprofiledetails', auth, getProfileDetails)
router.put('/updateprofilepicture', auth, updateProfilePicture)
router.delete("/deleteaccount", auth, isUser, deleteAccount)

module.exports = router;     