import bcrypt from "bcrypt";
import { User } from "../models/userModels.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";


export const register = async(req, res) => {
      try {
        const {name, gmail, password, address, role} = req.body;
        if(!name || !gmail || !password || !address || !role){
          return res.status(200).json({message: "All fields are required"});
        }
        const createdUser = await User.findOne({gmail});
        if(createdUser){
          return res.status(200).json({message: "User already exists"});
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
          name,
          gmail,
          password: hashPassword,
          address,
          role
        });
        generateTokenAndSetCookie(user._id, res);
        res.status(201).json({
          success: true,
          message: "User registered successfully",
          user
        });
      } catch (error) {
        console.log("error occur in register controller", error);
        res.status(500).json({ message: "Internal server error in register" });
      }
}


export const login = async(req, res) => {
    try {
        const {gmail, password} = req.body;
        if(!gmail || !password){
            return res.status(400).json({message: "All fields are required"});
            }
        const user = await User.findOne({gmail});
        if(!user){
            return res.status(404).json({message: "User not registered yet"});
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch){
            return res.status(401).json({message: "Incorrect password"});
        }
        generateTokenAndSetCookie(user._id, res);
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user
        });
    } catch (error) {
        console.log("error occur in login controller", error);
        res.status(500).json({ message: "Internal server error in login" });
    }
}


export const logout = (req, res) => {
   try {
        res.cookie("token", "", { maxAge: 0 });
		res.status(200).json({ message: "Logged out successfully" });
   } catch (error) {
        console.log("error occur in logout controller", error);
        res.status(500).json({ message: "Internal server error in logout" });
   }
}


export const getAllUsers = async(req, res) => {
    try {
        const loggedInUser = req.user;
        if(loggedInUser.role !== "admin"){
            return res.status(403).json({message: "Access denied. Admins only"});
        }
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        if(filteredUsers.length === 0){
            return res.status(404).json({ message: "No users found" });
        }
		res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("error occur in getAllUsers controller", error);
        res.status(500).json({ message: "Internal server error in getAllUsers" });
    }
}


export const deleteUser = async(req, res) => {
    try {
        const loggedInUser = req.user;
        if(loggedInUser.role !== "admin"){
            return res.status(403).json({message: "Access denied. Admins only"});
        }
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted Successfully" });
    } catch (error) {
        console.log("error occur in deleteUser controller", error);
        res.status(500).json({ message: "Internal server error in deleteUser" });
    }
}


export const updateProfile = async(req, res) => {
    try {
        const {name, gmail, address} = req.body;
        if(!name || !gmail || !address){
            return res.status(400).json({message: "Fill all the fields"});
        }
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {name, gmail, address},
            {new: true}
        ).select("-password");
        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            updatedUser
        });
    } catch (error) {
        console.log("error occur in updateProfile controller", error);
        res.status(500).json({ message: "Internal server error in updateProfile" });
    }
}


export const addUser = async(req, res) => {
    try {
        const loggedInUser = req.user;
        if(loggedInUser.role !== "admin"){
            return res.status(403).json({message: "Access denied. Admins only"});
        }
        const {name, gmail, password, address, role} = req.body;
        if(!name || !gmail || !password || !address || !role){
          return res.status(400).json({message: "All fields are required"});
        }
        const createdUser = await User.findOne({gmail});
        if(createdUser){
            return res.status(409).json({message: "User already exists, you cant add same user again"});
            }
        const hashPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            gmail,
            password: hashPassword,
            address,
            role
            });
        res.status(201).json({
            success: true,
            message: "User added successfully",
            user
        });
    } catch (error) {
        console.log("error occur in addUser controller", error);
        res.status(500).json({ message: "Internal server error in addUser" });
    }
}