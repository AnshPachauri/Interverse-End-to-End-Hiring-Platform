import mongoose from 'mongoose';
import { ENV } from './env.js';

export const connectDB = async () => {
    try{
        const conn = await mongoose.connect(ENV.DB_URL);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }catch(err){
        console.error("Error in connecting to MongoDB",err);
        process.exit(1);
    }
}