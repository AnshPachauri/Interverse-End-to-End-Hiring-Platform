import Session from "../models/Session.js";
import { streamClient, chatClient } from "../lib/stream.js";

export async function createSession(req,res){
    try{
        const {problem,difficulty} = req.body;
        const userId = req.user._id;
        const clerkId = req.user.clerkId;

        if(!problem || !difficulty){
            return res.status(400).send("Problem and difficulty are required");
        }

        // generate a unique call id to stream video call
        const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        // create session in db
        const session = await Session.create({
            problem,
            difficulty,
            host : userId,
            callId
        });
        // create stream video call
        await streamClient.video.call("default",callId).getOrCreate({
            data : {
                createdBy : clerkId,
                custom : {problem,difficulty,sessionId : session._id.toString()}
            }
        });
        // chat messageing
        const channel = chatClient.channel("messaging",callId,{
            name : `${problem} Session`,
            created_by_id : clerkId,
            members : [clerkId]
        });
        await channel.create();
        res.status(201).json({session});


    }catch(err){
        console.error("Error in creating session",err);
        res.status(500).json({message : "Internal Server Error"});
    }
}

export async function getActiveSessions(req,res){
    try{
        const sessions = await Session.find({status : "active"})
        .populate("host","name profileImage")
        .sort({createdAt : -1})
        .limit(20);
        res.status(200).json(sessions);
    }catch(err){
        console.error("Error in getting active sessions",err);
        res.status(500).json({message : "Internal Server Error"});
    }
}

export async function getMyRecentSessions(req,res){
    // get those sessions in which suer was either a host or a participant
    try{
        const userId = req.user._id;
        const sessions =await Session.find({status : "completed" , $or : [{host : userId},{participant : userId}]})
        .sort({createdAt : -1})
        .limit(20);

        res.status(200).json(sessions);
    }catch(err){
        console.error("Error in getting my recent sessions",err);
        res.status(500).json({message : "Internal Server Error"});
    }
}

export async function getSessionById(req,res){
    try{
        const {id} = req.params;
        const session = await Session.findById(id)
        .populate("host","name email profileImage clerkId")
        .populate("participant","name email profileImage clerkId");

        if(!session){
            return res.status(404).send("Session not found");
        }
        res.status(200).json(session);
    }catch(err){
        console.error("Error in getting session by id",err);
        res.status(500).json({message : "Internal Server Error"});
    }
}

export async function joinSession(req,res){
    try{
        const {id} = req.params;
        const userId = req.user._id;
        const clerkId = req.user.clerkId;

        const session = await Session.findById(id);
        if(!session){
            return res.status(404).send("Session not found");
        }
        if(session.status !== "active"){
            return res.status(400).send("Session is not active");
        }
        // host can not be a participant
        if(session.host.toString() === userId.toString()){
            return res.status(400).send("You are already the host of this session");
        }
        // check if session already has a participant
        if(session.participant){
            return res.status(400).send("Session already has a participant");
        }
        session.participant = userId;
        await session.save();

        // create stream video call
        const channel = chatClient.channel("messaging",session.callId);
        await channel.addMembers([clerkId]);

        res.status(201).json({session});

    }catch(err){
        console.error("Error in joining session",err);
        res.status(500).json({message : "Internal Server Error"});
    }
}

export async function endSession(req,res){
    try{
        const {id} = req.params;
        const userId = req.user._id;

        const session = await Session.findById(id);
        if(!session){
            return res.status(404).send("Session not found");
        }
        // check if user is the host or not
        if(session.host.toString() !== userId.toString()){
            return res.status(403).send("You are not the host of this session");
        }
        // check if the session is already completed
        if(session.status === "completed"){
            return res.status(400).send("Session is already completed");
        }

        // delete stream video call
        const call = streamClient.video.call("default",session.callId);
        await call.delete({hard : true});
        // delete chat channel
        const channel = chatClient.channel("messaging",session.callId);
        await channel.delete();

        session.status = "completed";
        await session.save();
        
        res.status(200).json({session, message : "Session ended successfully"});
    }catch(err){
        console.error("Error in ending session",err);
        res.status(500).json({message : "Internal Server Error"});
    }
}
