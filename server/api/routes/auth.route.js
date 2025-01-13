import express from 'express'
import {signup,getalluser,signin,google,signOut} from "../controller/auth.controller.js"

const router = express.Router();

router.post("/signup",signup);
router.get("/signup",getalluser);
router.post('/signin',signin);
router.post('/google',google);
router.get('/signout',signOut);

export default router;