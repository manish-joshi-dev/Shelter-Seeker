import { errorHandler } from "../utils/error.js";
import User from "../model/user.model.js";
import Listing from "../model/listing.model.js";
import bcryptjs from 'bcryptjs'


export const test = (req,res)=>{
    res.send("Hello!!!!!");
};

export const updateUser = async(req,res,next)=>{
    if (req.user.id != req.params.id) return next(errorHandler(401,'You can only update your own account'));
    try {
        if(req.body.password){
            req.body.password = bcryptjs.hashSync(req.body.password,10);
        }
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set:{
                    username: req.body.username,
                    email: req.body.email,
                    password:req.body.password,
                    avatar: req.body.avatar,
                    
                },
            },
            {new:true}
        );

        const {password,...rest} = updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
}

export const deleteUser = async (req,res,next)=>{
    if (req.user.id != req.params.id) return next(errorHandler(401,'You can only delete your own account'));
    try {
       // Delete user's listings
       await Listing.deleteMany({ userRef: req.params.id });
       
       // Delete user's conversations (both as landlord and tenant)
       const Conversation = (await import('../model/conversation.model.js')).default;
       await Conversation.deleteMany({
         $or: [
           { landlordId: req.params.id },
           { tenantId: req.params.id }
         ]
       });
       
       // Delete the user
       const deletedUser = await User.findByIdAndDelete(req.params.id);
       if (!deletedUser) return next(errorHandler(404, 'User not found'));
       
       res.clearCookie('access_token');
       res.status(200).json({ success: true, message: 'User has been deleted successfully!' });
        
    } catch (error) {
        next(error);
    }
}

export const getUserListings = async(req,res,next)=>{
    if (req.user.id != req.params.id) return next(errorHandler(401,'You can only delete your own account'));
    try {
        const listings = await Listing.find({ userRef: req.params.id });
        res.status(200).json(listings);
         
     } catch (error) {
         next(error);
     }
}
export const getUser = async(req,res,next)=>{
    try {
        const user = await User.findById(req.params.id);
        if(!user) return next(errorHandler(404,'User not found'));
        console.log(user);
        const {password:pass,...rest} = user._doc;
        res.status(200).json(rest);
    
        
    } catch (error) {
        next(error);
    }
}

