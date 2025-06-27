import { body } from 'express-validator'
import User from '../models/user.model.js'

export const signup = [
    body('fullName')
        .isLength({ min: 6, max: 30 })
        .withMessage("The name cannot be less than 6 and more than 30 characters.")
        .notEmpty()
        .withMessage("The name field cannot be empty."),
    body('email')
    .custom(async (value) => {
        const existingUser = await User.findOne({ email: value });
        if (existingUser) {
            throw new Error('This email is already in use');
        }
        return true;
    })
        .notEmpty()
        .withMessage("Mail cannot be empty"),
    body('password')
        .isLength({ min: 6, max: 30 })
        .withMessage("The password cannot be less than 6 and more than 30 characters.")
        .notEmpty()
        .withMessage("Password cannot be empty")
    
]