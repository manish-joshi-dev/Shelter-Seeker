import express from 'express';
import cookieParser from "cookie-parser"
import userAuth from './routes/userAuth.js';
import userRoute from './routes/user.route.js';
import listingRoute from './routes/listing.route.js';
import dotenv from 'dotenv';
import chatRoute from './routes/chat.route.js';
import trustRoute from './routes/trust.route.js';

dotenv.config();

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("Connected to MongoDB")
}).catch((err)=>{
    console.log(err);
})

const app = express();
const port = 5000;

app.get('/',(req,res)=>{
    res.send('Hello from the server');
});

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth',userAuth);
app.use('/api/users',userRoute);
app.use('/api/listings',listingRoute);
app.use('/api/chat', chatRoute);
app.use('/api/trust', trustRoute);


app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
})
