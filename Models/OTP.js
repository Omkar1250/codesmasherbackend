const mongoose = require('mongoose');
const mailSender = require("../utils/mailsender")
const emailTemplate = require("../mail/template/emailVerification")
const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        rquired:true,
    },
    createdAt:{
        type:Date,
        default: Date.now, 
        expires: 60* 5,
    },
});
// Define a function to send emails
async function sendVerificationEmail(email, otp) {
    console.log("Printing email from otp sec", email )
    console.log("Printing otpppp from otp sec", otp )
	// Create a transporter to send emails

	// Define the email options

	// Send the email
	try {
		const mailResponse = await mailSender(
			email,
			"Verification Email",
			emailTemplate(otp) 
		);
		console.log("Email sent successfully: ", mailResponse.response);
	} catch (error) {
		console.log("Error occurred while sending email: ", error);
		throw error;
	}
}

// Define a post-save hook to send email after the document has been saved
otpSchema.pre("save", async function (next) {
	console.log("New document saved to database");

	// Only send an email when a new document is created
	if (this.isNew) {
		await sendVerificationEmail(this.email, this.otp);
	}
	next();
});

module.exports = mongoose.model('OTP', otpSchema)