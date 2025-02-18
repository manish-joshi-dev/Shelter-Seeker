import express from 'express';
import { verifyToken } from '../utils/verifyToken.js';
import {
    createOrUpdateInsights,
    getInsights,
    voteOnInsight,
    askQuestion,
    answerQuestion,
    voteOnAnswer,
    getNearbyLocalities,
    getNearbyLocalityInsights
} from '../controller/localityInsight.controller.js';

const router = express.Router();

// Public routes
router.get('/get/:listingId', getInsights);
router.get('/nearby/:listingId', getNearbyLocalityInsights);

// Protected routes (require authentication)
router.post('/create', verifyToken, createOrUpdateInsights);
router.post('/vote', verifyToken, voteOnInsight);
router.post('/ask-question', verifyToken, askQuestion);
router.post('/answer-question', verifyToken, answerQuestion);
router.post('/vote-answer', verifyToken, voteOnAnswer);

export default router;
