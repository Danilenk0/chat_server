import User from '../models/user.model.js'
import { validationResult } from 'express-validator'
import bcrypt from 'bcryptjs'
import {generateToken} from '../lib/utils.js'

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

export const logout = () => {
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