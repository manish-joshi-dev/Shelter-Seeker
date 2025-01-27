import express from 'express'
import { getOrCreateConversation, appendMessage, listMyConversations, startConversationByListing } from '../controller/chat.controller.js'
import { verifyToken } from '../utils/verifyToken.js'

const router = express.Router()

router.get('/conversation', verifyToken, getOrCreateConversation)
router.post('/message', verifyToken, appendMessage)
router.get('/my', verifyToken, listMyConversations)
router.get('/start-by-listing', verifyToken, startConversationByListing)

export default router


