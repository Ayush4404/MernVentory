const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"]
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    trim: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please enter a valid email"
    ]
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minLength: [6, "Password must be at least 6 characters"],
    // maxLength: [23, "Password must not exceed 23 characters"],
  },
  photo: {
    type: String,
    default: "https://i.ibb.co/4pDNDk1/avatar.png"
  },
  phone: {
    type: String,
    default: "+91"
  },
  bio: {
    type: String,
    maxLength: [250, "Bio must not exceed 250 characters"],
    default: "bio"
  }
}, {
  timestamps: true
});
  //encrypt password before saving to the db
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next();
    }
    //hash the password 
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password,salt);//password prop in this file
    this.password = hashedPassword;
    next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
