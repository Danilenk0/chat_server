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

}