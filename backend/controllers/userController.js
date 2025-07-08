const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { copyFile } = require("fs");
const Token = require("../models/tokenModel");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const generateToken =(id) =>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"1d"})
};

//register and login so seperate login token


//register user code
const registerUser = asyncHandler( async(req, res)=>{
    console.log("Route hit");
    const { name, email , password} =req.body
    //validation
    if(!name || !email || !password){
        res.status(400)
        throw new Error("please fill all required filled")
    }
    if(password.length<6){
        res.status(400)
        throw new Error("Password must be upto 6 characters")
    }
    //check if user email exist
    const userExists = await User.findOne({email})

    if(userExists){
        res.status(400)
        throw new Error("email has already been used")
    }
    //encrypt password before saving to the db
    // const salt = await bcrypt.genSalt(10)
    // const hashedPassword = await bcrypt.hash(password,salt)

   
    //create new user
    const user = await User.create({
        name,
        email,
        password,
    });

     //generate the token
    const token = generateToken(user._id);
    //send http -only cookie to front
    res.cookie("token", token, {
        path:"/",
        httpOnly: true,
        expires: new Date(Date.now()+1000*86400),// this is one day
        sameSite: "none",
        secure: true

    });

    if(user){
        const{_id,name,email,photo , phone ,bio} =user
        res.status(201).json({
            _id ,name,email,photo , phone ,bio,token,
        });
    }
    else{
        res.status(400)
        throw new Error("Invalid user data")
    }
});

//loginuser
const loginUser = asyncHandler(async(req,res)=>{
    // res.send("Login User");
    const{email, password} = req.body
    //validate
    if(!email || !password){
        res.status(400)
        throw new Error("please add email and password");
    }
    //check if user exist
    const user = await User.findOne({email})
        if(!user){
        res.status(400)
        throw new Error("User donot exist please signup");
    }
    //check if the password is correct after the user 
    const passwordIsCorrect = await bcrypt.compare(password, user.password);
     //generate the token
    const token = generateToken(user._id);
    //send http -only cookie to front
    res.cookie("token", token, {
        path:"/",
        httpOnly: true,
        expires: new Date(Date.now()+1000*86400),// this is one day
        sameSite: "none",
        secure: true

    });

    //now give usesr info
    if(user && passwordIsCorrect){
        const{_id,name,email,photo , phone ,bio} =user
        res.status(200).json({
            _id ,name,email,photo , phone ,bio,token,
        });
    }
    else{
        res.status(400)
        throw new Error("Invalid email or password");
    }
});
//logout user
const logoutUser = asyncHandler(async(req,res)=>{
    // res.send("logout");
        res.cookie("token", "", {
        path:"/",
        httpOnly: true,
        expires: new Date(0),// this is expire the cookie
        sameSite: "none",
        secure: true

    });
    res.json({ message: "Successfully logged out" });//no need to add res.status(200) as that is default and will caues header issues

});

//get user profile data
const getUser = asyncHandler(async(req,res)=>{
    // res.send("get user data");
    const user = await User.findById(req.user._id)

    if(user){
        const{_id,name,email,photo , phone ,bio} =user ;
        res.status(201).json({
            _id ,name,email,photo , phone ,bio,
        });
    }
    else{
        res.status(400)
        throw new Error("user not found")
    }
});
//get login status
const loginStatus = asyncHandler(async(req,res)=>{
    const token = req.cookies.token;
    if(!token){
        return res.json(false);
    }
     //verify token
    const verified =jwt.verify(token,process.env.JWT_SECRET);
    if(verified){
        return res.json(true);
    }
    return res.json(false);
    // res.send("loggedin");
});
//update the user profile
const updateUser =asyncHandler(async(req,res)=>{
    // res.send("update the user")
    const user = await User.findById(req.user._id);

    if(user){
        const{name,email,photo , phone ,bio} =user ;
        user.email = email;
        user.name = req.body.name || name;
        user.phone = req.body.phone || phone;
        user.bio = req.body.bio || bio;
        user.photo = req.body.photo || photo;

        const updatedUser = await user.save()
        res.status(200).json({
            // _id :updatedUser._id,
            name:updatedUser.name,
            email:updatedUser.email,
            photo:updatedUser.photo , 
            phone:updatedUser.phone ,
            bio:updatedUser.bio,
        })
    }
    else{
        res.status(400)
        throw new Error("user not found");
    }
});

// for changing the password
const changePassword = asyncHandler(async(req,res)=>{
    // res.send("change password");
    const user = await User.findById(req.user._id);

    const{oldPassword , password}=req.body ||{}
    //validate
    if(!user){
        res.status(400)
        throw new Error("uer not found please signup");
    }
    if(!oldPassword || !password){
        res.status(400)
        throw new Error("please add old and new password");
    }
    //check if password is matching the old password in db
    const passwordIsCorrect = await bcrypt.compare(oldPassword,user.password)

    //save new password
    if(user && passwordIsCorrect){
        user.password =password
        await user.save()
        res.status(200).send("password changed successful");
    }
    else{
        res.status(400)
        throw new Error("old password is incorrect");
    }
});




const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User does not exist");
  }

  // Delete existing tokens for this user (optional but clean)
  await Token.deleteMany({ userId: user._id });

  // Create new reset token
  const resetToken = crypto.randomBytes(32).toString("hex") + user._id;

  // Hash token
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Save token to DB
  await new Token({
    userId: user._id,
    token: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 30 * 60 * 1000, // 30 minutes
  }).save();

  // Construct reset URL
  const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

  // Prepare email content
  const subject = "Password Reset Request";
  const send_to = user.email;
  const sent_from = process.env.EMAIL_USER;
  const message = `
    <h2>Hello ${user.name},</h2>
    <p>You requested a password reset. Please use the link below to reset your password:</p>
    <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
    <p><b>This link is valid for 30 minutes.</b></p>
    <br/>
    <p>Regards,</p>
    <p><strong>MERNventory Team</strong></p>
  `;

  try {
    await sendEmail(subject, message, send_to, sent_from);
    res.status(200).json({
      success: true,
      message: "Reset Email Sent",
    });
  } catch (error) {
    res.status(500);
    throw new Error("Email not sent. Please try again later.");
  }
});

//reset password 
const resetPassword =asyncHandler(async(req,res)=>{
    // res.send("rest the pass")
    const {password}=req.body
    const {resetToken}= req.params

    // Hash token then compare with database
    const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

    //find token in db
    const userToken = await Token.findOne({
        token:hashedToken,
        expiresAt:{$gt: Date.now()}
    })
    if(!userToken){
    res.status(404);
    throw new Error("Invalid or expired token");
    }
    //find the user
    const user = await User.findOne({_id: userToken.userId})
    user.password = password
    await user.save()
    res.status(200).json({message:"Password reset succesful please login"})

});

module.exports = { registerUser,
    loginUser,
    logoutUser,
    getUser,
    loginStatus,
    updateUser,
    changePassword,
    forgotPassword,
    resetPassword,

};
