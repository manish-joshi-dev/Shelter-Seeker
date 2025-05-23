import User from "../model/user.model.js";
import bcryptjs from "bcryptjs";
import {errorHandler} from "../utils/error.js" ;
import jwt from 'jsonwebtoken';

export const signup = async(req,res,next)=>{
    
        // console.log(req.body)
        const {username,email,password} = req.body;
        const hashedPassword = bcryptjs.hashSync(password,10);

        const newUser = new User({username,email,password:hashedPassword});
        try{
        await newUser.save();
        res.status(201).json('User created succesfully');
    }
    catch(err){
        // res.status(500).json(e.message);
        // next(errorHandler(500,'Error found in function'));
        next(err);
        // res.send(e.message);
        // res.send("hii")
    }

};
export const getalluser  = async(req,res) =>{
    try{
        const alluser  = await User.find();
        res.status(201).json({
            alluser
        });
    }
    catch{
        res.status(404).json("not fetched")
    }
}

export const signin = async (req,res,next)=>{
    const {email,password} = req.body;
    try {
        const validUser = await User.findOne({email});
    if(!validUser) return res.status(404).json(errorHandler(404,'User not found',false));
    console.log(validUser)
    const validPassword = bcryptjs.compareSync(password,validUser.password);
    console.log(validPassword)
    if(!validPassword) return  res.status(404).json(errorHandler(401,'Invalid Credentials',false));
    
    // Check if user is banned
    if(validUser.isBanned) return res.status(403).json(errorHandler(403,'Account is banned. Reason: ' + validUser.banReason,false));
    const token = jwt.sign({id:validUser._id, role: validUser.role},process.env.JWT_SECRET);
    console.log(validUser._doc);
    const {password:pass,...rest}=validUser._doc;
    res.cookie('access_token',token,{httpOnly:true}).status(201).json(rest);
    } catch (error) {
        next(error);
    }


};

export const google = async(req,res,next)=>{
    try {
        const {name, email, photo} = req.body;
        
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        const validUser = await User.findOne({email: email});
        if(validUser){
            const token = jwt.sign({id:validUser._id, role: validUser.role}, process.env.JWT_SECRET || 'fallback_secret');
            console.log('Existing user found:', validUser._doc);
            const {password:pass,...rest}=validUser._doc;
            res.cookie('access_token',token,{
                httpOnly:true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 24 * 60 * 60 * 1000 // 24 hours
            }).status(200).json({
                success: true,
                message: 'Sign in successful',
                user: rest
            });
        }
        else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword,10);
            const username = name ? name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4) : 
                            email.split("@")[0] + Math.random().toString(36).slice(-4);
            
            const newUser = new User({
                username: username,
                email: email, 
                password: hashedPassword,
                avatar: photo || ""
            });
            
            await newUser.save();
            const token = jwt.sign({id:newUser._id, role: newUser.role}, process.env.JWT_SECRET || 'fallback_secret');
            
            const {password:pass,...rest}=newUser._doc;
            res.cookie('access_token',token,{
                httpOnly:true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 24 * 60 * 60 * 1000 // 24 hours
            }).status(201).json({
                success: true,
                message: 'User created and signed in successfully',
                user: rest
            });
        }
    } catch (error) {
        console.error('Google OAuth error:', error);
        next(error);
    }
};

export const signOut = async(req,res,next)=>{
    try {
        res.clearCookie('access_token');
        res.status(200).json('You have been successfully logged out');
    } catch (error) {
        next(error);
    }
}

