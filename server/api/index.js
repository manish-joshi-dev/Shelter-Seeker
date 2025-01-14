import express from 'express';
import cookieParser from "cookie-parser"
import userAuth from './routes/userAuth.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 5000;

app.get('/',(req,res)=>{
    res.send('Hello from the server');
});

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth',userAuth);


app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
})
