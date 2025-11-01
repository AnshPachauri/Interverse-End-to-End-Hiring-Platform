import { StreamChat } from 'stream-chat';
import { ENV } from './env.js';

const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_SECRET;

if(!apiKey || !apiSecret){
    throw new Error("Missing STREAM_API_KEY or STREAM_API_SECRET");
}

export const chatClient = new StreamChat(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
    try{
        await chatClient.upsertUser(userData);
        console.log("User upserted successfully:",userData);
    }catch(err){
        console.error("Error in upserting user",err);
    }
}
export const deleteStreamUser = async (userId) => {
    try{
        await chatClient.deleteUser(userId);
        console.log("User deleted successfully:",userId);
    }catch(err){
        console.error("Error in deleting user",err);
    }
}

// todo : add another method to generateToken
