import User from '../models/user.model.js'
import { validationResult } from 'express-validator'
import bcrypt from 'bcryptjs'
import { generateToken } from '../lib/utils.js'
import coudinary from '../lib/cloudinary.js'
import cloudinary from '../lib/cloudinary.js'

export const signup = async (req, res)=>{
    try {
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            return res.status(400).json(validationErrors)
        }

        const { fullName, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        });

        if (newUser) {
            generateToken(newUser._id, res)
            await newUser.save()
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic:newUser.profilePic
            })
        }
    } catch (error) {
        console.log("Error in signup controller", error.message)
        res.status(500).json({
            message:"Internal server error"
        })
    }
}

export const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        
        if (!user) {
            return res.status(400).json({
                message:"Invalid credentials"
            })
        }

        const isCorrectPassword = await bcrypt.compare(password, user.password)

        if (!isCorrectPassword) {
            return res.status(400).json({
                message:"Invalid credentials"
            })
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic:user.profilePic
        })
    } catch (error) {
        console.log("Error in singin controller ", error.message)
        res.status(500).json({
            message:"internal server error"
        })
    }
}

export const logout = (req, res) => {
    try {
        res.cookie('jwt', '', { maxAge: 0 })
        res.status(200).json({
            message:'Logged out is successful'
        })
        
    } catch (error) {
        console.log("Error in logout controller ", error.message);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({
                message:"Profile picture is required"
            })
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        const updatedUser = await User.findByIdAndUpdate({ profilePic: uploadResponse.secure_url })
        
        res.status(200).json(updatedUser)
        
    } catch (error) {
        consol.log('Error in update profile controller ', error.message)
        res.status(500).json({
            message:"Invalid server error"
        })
    }
}

export const checkAuth = async (req, res) => {
    try {
        res.status(200).json(req.user)
        
    } catch (error) {
        console.log("Error in check auth controller", error.message)
        res.status(500).json({
            message:"Internal server error"
        })
    }
}