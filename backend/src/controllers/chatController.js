import { chatClient } from "../lib/stream.js";
export async function getStreamToken(req,res){
    try{    
        // use clerk id for stream not mongo id
        const token = chatClient.createToken(req.user.clerkId);
        res.status(200).json({
            token,
            userId : req.user.clerkId,
            userName : req.user.name,
            userImage : req.user.profileImage,
        });
    }catch(err){
        console.error("Error in getting stream token",err);
        res.status(500).json({message : "Internal Server Error"});
    }
}