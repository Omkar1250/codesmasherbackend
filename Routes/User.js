const express = require('express');
const router = express.Router();


//import controllers and middleware functions
const {
    login,
    signup,
    sendotp,

}= require("../Controller/Auth");
const { sign } = require('jsonwebtoken');

router.post("/login", login);

router.post("/signup", signup);

router.post("/sendotp", sendotp)
module.exports = router;
