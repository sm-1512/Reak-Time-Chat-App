import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/util.js";
import cloudinary from "../lib/cloudinary.js";


export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 6 characters" });
    }

    const user = await User.findOne({ email });
    if (user)
      return res
        .status(400)
        .json({ message: "User Already Exists!! Proceed to Login" });

    //hash password : eg: 123456 => asdfgbasdhkfvbasklhf (something random) using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName, //fullName:fullName
      email, //email:email
      password: hashedPassword, //hashedPassword: hashedPassword
    });

    if (newUser) {
      //Generate JWT token here
      generateToken(newUser._id, res); //Generate new user and also log them
      await newUser.save();

      return res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      return res.status(400).json({ message: "Invalid User Data" });
    }
  } catch (error) {
    console.log("Error in SignUp Controller:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid Credentials." });

    const isPasswordCorrect = await bcrypt.compare(password, user.password); //user.password is in the database and password is the one that the user is sending
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid Credentials." });

    generateToken(user._id, res);
    return res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in Login Controller:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    return res.status(200).json({ message: "Logged Out Successfully" });
  } catch (error) {
    console.log("Error in LogOut Controller:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const {profilePic} = req.body;
    const userId= req.user._id;
    if(!profilePic) {
      return res.status(400).json({message:"Profile Picture Required"})
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic); //Cloudinary is just a bucket for my images, we need to update the database
    const updatedUser = await User.findByIdAndUpdate(userId, {profilePic: uploadResponse.secure_url}, {new:true}); //Find the user by his id and update it.
    return res.status(200).json(updatedUser)

  } catch (error) {
    console.log("error in update profile:", error);
    return res.status(500).json({message: "Internal Server Error"})
  }
}

//This route is being created in case when user refreshes then whether to take him to login page or profile page.
export const checkAuth = (req, res) => {
  try {
    return res.status(200).json(req.user); //Send the user back to the client
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    return res.status(500).json({message:"Internal Server Error"});    
  }
}
