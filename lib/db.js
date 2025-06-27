import mongoose from 'mongoose'

export const connectDB = async ()=>{
    try {
       const connection = await mongoose.connect(process.env.DB_URL);
       console.log("MongoDB connect: " + connection.connection.host)
    } catch (error) {
        console.log("MongoDB error: " + error)
    }
}