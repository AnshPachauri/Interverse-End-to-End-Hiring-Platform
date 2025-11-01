import { requireAuth } from "@clerk/express";
import User from "../models/User.js";

export const protectRoute =[ requireAuth(),
    async (req,res,next)=>{
        try{
            const clerkId = req.auth().user.id;
            if(!clerkId){
                return res.status(401).send("Unauthorized");
            }
            const user = await User.findOne({clerkId});
            if(!user){
                return res.status(404).send("User not found");
            }
            req.user = user;
            next();
        }catch(err){
            console.error("Error in protecting route",err);
        }   
    }

]