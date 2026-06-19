const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const User =
require('../models/User');

const {
sendOTPEmail,
sendWelcomeEmail
} = require('../utils/sendEmail');

// ── Helper: generate 6-digit OTP ──

const generateOTP = () =>
Math.floor(100000 + Math.random() * 900000).toString();

// ── Helper: save OTP to user ──

const attachOTP = async(user, type) => {
const otp      = generateOTP();
user.otp       = otp;
user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
user.otpType   = type;
await user.save();
return otp;
};

// ================= REGISTER =================

exports.register =
async(req,res)=>{

try{

const {
name,
email,
password,
role
} = req.body;

const existingUser =
await User.findOne({email});

if(existingUser){

return res.status(400).json({
message:'User Already Exists'
});

}

// HASH PASSWORD

const hashedPassword =
await bcrypt.hash(password,10);

const user =
await User.create({

name,
email,

password:
hashedPassword,

role,

isVerified:false,

});

// SEND VERIFICATION OTP

const otp =
await attachOTP(user,'verify');

await sendOTPEmail(
email,
name,
otp,
'verify'
);

res.status(201).json({

success:true,
message:'Registered! Check your email for the verification OTP.'

});

}catch(err){
  console.error('LOGIN ERROR:', err);
  res.status(500).json({
    message: err.message
  });
}


};

// ================= VERIFY EMAIL =================

exports.verifyEmail =
async(req,res)=>{

try{

const {email,otp} = req.body;

if(!email || !otp){
return res.status(400).json({
message:'Email and OTP are required'
});
}

const user =
await User.findOne({email});

if(!user){
return res.status(404).json({
message:'User not found'
});
}

if(user.isVerified){
return res.status(400).json({
message:'Account already verified'
});
}

if(user.otpType !== 'verify'){
return res.status(400).json({
message:'Invalid OTP type'
});
}

if(user.otp !== otp){
return res.status(400).json({
message:'Incorrect OTP'
});
}

if(new Date() > user.otpExpiry){
return res.status(400).json({
message:'OTP expired. Request a new one.'
});
}

user.isVerified = true;
user.otp        = null;
user.otpExpiry  = null;
user.otpType    = null;
await user.save();

await sendWelcomeEmail(
email,
user.name,
user.role
);

res.json({
success:true,
message:'Email verified! You can now log in.'
});

}catch(err){

res.status(500).json({
message:err.message
});

}

};

// ================= RESEND OTP =================

exports.resendOTP =
async(req,res)=>{

try{

const {email} = req.body;

const user =
await User.findOne({email});

if(!user){
return res.status(404).json({
message:'User not found'
});
}

if(user.isVerified){
return res.status(400).json({
message:'Account already verified'
});
}

// RATE LIMIT: block if OTP sent less than 1 min ago

if(
user.otpExpiry &&
new Date() < new Date(user.otpExpiry.getTime() - 9 * 60 * 1000)
){
return res.status(429).json({
message:'Please wait before requesting another OTP'
});
}

const otp =
await attachOTP(user,'verify');

await sendOTPEmail(
email,
user.name,
otp,
'verify'
);

res.json({
success:true,
message:'OTP resent to your email.'
});

}catch(err){

res.status(500).json({
message:err.message
});

}

};


// ================= LOGIN =================

exports.login =
async(req,res)=>{

try{

const {
email,
password
} = req.body;

const user =
await User.findOne({email});

if(!user){

return res.status(400).json({
message:'Invalid Credentials'
});

console.log('PASSWORD MATCH:', isMatch);


}

// EMAIL VERIFICATION TEMPORARILY DISABLED

// if(!user.isVerified){

// return res.status(403).json({
// success:false,
// message:'Please verify your email before logging in.',
// needsVerification:true,
// });

// }







// COMPARE HASHED PASSWORD

const isMatch =
await bcrypt.compare(
password,
user.password
);

if(!isMatch){

return res.status(400).json({
message:'Invalid Credentials'
});

}

// JWT TOKEN

const token =
jwt.sign(

{
id:user._id,
role:user.role
},

process.env.JWT_SECRET,

{
expiresIn:'7d'
}

);

res.json({

success:true,

token,

user:{
id:user._id,
name:user.name,
role:user.role
}

});

}catch(err){

res.status(500).json({
message:err.message
});

}

};

// ================= FORGOT PASSWORD =================

exports.forgotPassword =
async(req,res)=>{

try{

const {email} = req.body;

if(!email){
return res.status(400).json({
message:'Email is required'
});
}

const user =
await User.findOne({email});

// ALWAYS RETURN SUCCESS (prevents user enumeration)

if(!user){
return res.json({
success:true,
message:'If that email exists, an OTP has been sent.'
});
}

if(!user.isVerified){
return res.status(403).json({
message:'Please verify your account first.'
});
}

const otp =
await attachOTP(user,'reset');

await sendOTPEmail(
email,
user.name,
otp,
'reset'
);

res.json({
success:true,
message:'Password reset OTP sent to your email.'
});

}catch(err){

res.status(500).json({
message:err.message
});

}

};

// ================= VERIFY RESET OTP =================

exports.verifyResetOTP =
async(req,res)=>{

try{

const {email,otp} = req.body;

const user =
await User.findOne({email});

if(!user){
return res.status(404).json({
message:'User not found'
});
}

if(user.otpType !== 'reset'){
return res.status(400).json({
message:'No password reset requested'
});
}

if(user.otp !== otp){
return res.status(400).json({
message:'Incorrect OTP'
});
}

if(new Date() > user.otpExpiry){
return res.status(400).json({
message:'OTP expired. Request a new one.'
});
}

// SHORT-LIVED RESET TOKEN

const resetToken =
jwt.sign(

{
id:user._id,
purpose:'reset'
},

process.env.JWT_SECRET,

{
expiresIn:'15m'
}

);

// CLEAR OTP SO IT CANT BE REUSED

user.otp       = null;
user.otpExpiry = null;
user.otpType   = null;
await user.save();

res.json({
success:true,
resetToken
});

}catch(err){

res.status(500).json({
message:err.message
});

}

};

// ================= RESET PASSWORD =================

exports.resetPassword =
async(req,res)=>{

try{

const {
resetToken,
newPassword
} = req.body;

if(!resetToken || !newPassword){
return res.status(400).json({
message:'Token and new password are required'
});
}

if(newPassword.length < 6){
return res.status(400).json({
message:'Password must be at least 6 characters'
});
}

let decoded;

try{
decoded = jwt.verify(
resetToken,
process.env.JWT_SECRET
);
}catch{
return res.status(401).json({
message:'Reset token is invalid or expired'
});
}

if(decoded.purpose !== 'reset'){
return res.status(401).json({
message:'Invalid token'
});
}

const user =
await User.findById(decoded.id);

if(!user){
return res.status(404).json({
message:'User not found'
});
}

user.password =
await bcrypt.hash(newPassword,10);

await user.save();

res.json({
success:true,
message:'Password reset successfully. You can now log in.'
});

}catch(err){

res.status(500).json({
message:err.message
});

}

};