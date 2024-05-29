const bcrypt = require("bcryptjs");
const User = require("../Models/User");
const OTP = require("../Models/OTP");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const mailSender = require("../utils/mailsender.js")

const Profile = require("../Models/Profile.js");
require("dotenv").config();

//Signup Controller for registering a new user
exports.signup = async(req, res) => {
    try{
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType, 
            otp,
        }= req.body;  

        //check if there all details are not
        if(
            !firstName ||
            !lastName ||
            !email  ||
            !password ||
            !confirmPassword ||
            !accountType ||
            !otp
        ){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        //check if password and confirm password matchs

        if( password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password and Confirm password dose not match please try again",
            })
        }
        
        //check user already exists or not
        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(400).json({
                    success:false,
                    message:"User already exists. Please login"
            })
        }
        //find most recent otp
        const response = await OTP.find({email}).sort({createdAt: -1}).limit(1)
   

        if(response.length === 0){
            return res.status(400).json({
                success:false,
                message:'The OTP is not valid'

            })
        } else if(otp !== response[0].otp) {
                //invalid otp
                return res.status(400).json({
                    success:false,
                    message:'OTP is not valid',
                })

        }
        //Hash the password
        const hashedPassword = await bcrypt.hash(password, 10)

        //Create the user 
        let approved = ""
        approved === "Admin" ? (approved= false) : (approved = true);
        const diceBearImageUrl = `https://api.dicebear.com/5.x/initials/svg?seed=${encodeURIComponent(firstName)}+${encodeURIComponent(lastName)}`;
        //Create the additional profile for the user
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about:null,
            contactNumber:null,
        })

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            accountType: accountType,
            approved:  approved,
            additionalDetails: profileDetails._id,
            image: diceBearImageUrl,

        })

        return res.status(200).json({
            success:true,
            user,
            message: "User registered succefully",
        })
    }catch(error){
            
            return res.status(500).json({
                success:false,
                message:"User cannot registered, Please try again"
            })   
    }
}

//login controller for authenticaticating user

// Login controller for authenticating users
exports.login = async (req, res) => {
    try {
      // Get email and password from request body
      const { email, password } = req.body
  
      // Check if email or password is missing
      if (!email || !password) {
        // Return 400 Bad Request status code with error message
        return res.status(400).json({
          success: false,
          message: `Please Fill up All the Required Fields`,
        })
      }
  
      // Find user with provided email
      const user = await User.findOne({ email }).populate('additionalDetails').exec()
  
      // If user not found with provided email
      if (!user) {
        // Return 401 Unauthorized status code with error message
        return res.status(401).json({     
          success: false,
          message: `User is not Registered with Us Please SignUp to Continue`,
        }) 
      }       
  
      // Generate JWT token and Compare Password 
      if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign(
          { email: user.email, id: user._id, role: user.role },
          process.env.JWT_SECRET,
          {
            expiresIn: "24h",
          }
        )
  
        // Save token to user document in database
        user.token = token
        user.password = undefined
        // Set cookie for token and return success response
        const options = {
          expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          httpOnly: true,
        }        
        res.cookie("token", token, options).status(200).json({
          success: true,
          token,  
          user,
          message: `User Login Success`,
        })
      } else {
        return res.status(401).json({
          success: false,
          message: `Password is incorrect`,
        })
      }
    } catch (error) {
      console.error(error)
      // Return 500 Internal Server Error status code with error message
      return res.status(500).json({
        success: false,
        message: `Login Failure Please Try Again`,
      })
    }
  }
//send otp for email verification

exports.sendotp = async (req, res) => {
    try {
        const { email } = req.body; // Extract email from request body
       

        // Check if the user already exists
        const checkUserPresent = await User.findOne({ email });
        if (checkUserPresent) {
            return res.status(400).json({
                success: false,
                message: 'User already registered'
            });
        }

        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        // Check if the generated OTP already exists in the database
        let result = await OTP.findOne({ otp });
        while (result) {
            // Regenerate OTP until it is unique
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            result = await OTP.findOne({ otp });
        }

        // Store the email and OTP in the database
        const otpPayload = { email, otp };
        const otpBody = await OTP.create(otpPayload);
        

        // Return success response with generated OTP
        return res.status(200).json({
            success: true,
    
        });
    } catch (error) {
         // Log the error for debugging
        return res.status(500).json({ success: false, error: error.message });
    }
};