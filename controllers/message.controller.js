import Message from '../models/message.model.js'
import User from '../models/user.model.js'
import cloudinary from '../lib/cloudinary.js';


export const getUsers = async (req, res) => {
    try {
        const userId = req.user._id;
        console.log(req.user._id)

        const filteredUsers = await User.find({ _id: { $ne: userId } }).select('-password');
        res.status(200).json(filteredUsers)
        
    } catch (error) {
        console.log('Error in getUsers controller', error.message);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id: anotherUserId } = req.params;
        const myId = req.user._id;

        const messages = await User.find({
            $or: [
                {senderId:anotherUserId, receiverId:myId},
                {senderId:myId, receiverId:anotherUserId}
            ]
        })

        res.status(200).json(messages)
        
    } catch (error) {
        console.log("Error in getMessages controller", error.message);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageURL;

        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageURL = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageURL
        })

        await newMessage.save();

        res.ststus(201).json(newMessage)
        
    } catch (error) {
        console.log('Error in sendMessage controller', error.message);
        res.status(500).json({
            message: 'Internal serve error'
        });
    }
}
