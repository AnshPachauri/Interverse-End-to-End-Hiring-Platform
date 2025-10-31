import express from 'express';
import path from 'path';
import { ENV } from './lib/env.js';

const app = express();

const __dirname = path.resolve();

app.get('/world',(req,res) => {
    res.status(200).send('Hello World!')
})
app.get('books', (req,res) => {
    res.status(200).send('Books!')
})

// make our app ready for deployment
if(ENV.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname,'../frontend/dist')));
    app.get("/{*any" , (req,res) => {
        res.sendFile(path.join(__dirname,'../frontend/dist/index.html')); // any end point apart from '/world' &&'/books' will be served by index.html i.e react app
    })
}
app.listen(ENV.PORT,() => {
    console.log(`Server is running on port ${ENV.PORT}`)
})