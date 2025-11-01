import express from 'express';
import path from 'path';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';
import { serve } from 'inngest/express';

import { ENV } from './lib/env.js';
import { connectDB } from './lib/db.js';
import { inngest, functions } from './lib/inngest.js';
import { protectRoute } from './middleware/protectRoute.js';
import chatRoutes from './routes/chatRoutes.js';

const app = express();

const __dirname = path.resolve();

// middlewares
app.use(express.json());
app.use(cors({origin : ENV.CLIENT_URL, credentials: true}));    
app.use(clerkMiddleware()); // this adds auth field to request object : req.auth()

app.use("/api/inngest",serve({client:inngest, functions}))
app.use("/api/chat",chatRoutes);

app.get('/world',(req,res) => {
    res.status(200).send('Hello World!')
})

// make our app ready for deployment
if(ENV.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname,'../frontend/dist')));
    app.get("/{*any}" , (req,res) => {
        res.sendFile(path.join(__dirname,'../frontend/dist/index.html')); // any end point apart from '/world' &&'/books' will be served by index.html i.e react app
    })
}

const startServer = async () => {
    try{
        await connectDB();
        app.listen(ENV.PORT, () => {
            console.log(`Server started on port ${ENV.PORT}`);
        });
    }catch(err){
        console.error("Error in starting server",err);
    }
}

startServer();