import express from 'express';
import cookieParser from "cookie-parser"
import userAuth from './routes/userAuth.js';
import userRoute from './routes/user.route.js';
import listingRoute from './routes/listing.route.js';
import mongoose from 'mongoose';
import http from 'http';
import cors from 'cors';
import { Server as SocketIOServer } from 'socket.io';
// import { allowedOrigins } from '../config/corsConfig.js';
import dotenv from 'dotenv';
import chatRoute from './routes/chat.route.js';
import trustRoute from './routes/trust.route.js';
import reportRoute from './routes/report.route.js';
import { report } from 'process';

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

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked for origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth',userAuth);
app.use('/api/user',userRoute);
app.use('/api/listing',listingRoute);
app.use('/api/locality-insights',localityInsightRoutes);
app.use('/api/chat', chatRoute);
app.use('/api/trust', trustRoute);
app.use('/api/report',reportRoute)

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:3000',
  process.env.CLIENT_URL
].filter(Boolean);

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST']
  }
});



const userIdToSocketIds = new Map();

io.on('connection', (socket) => {
  // Expect `userId` in query for identification
  const { userId } = socket.handshake.query || {};

  if (userId && typeof userId === 'string') {
    const existing = userIdToSocketIds.get(userId) || new Set();
    existing.add(socket.id);
    userIdToSocketIds.set(userId, existing);
  }

  socket.on('join_conversation', ({ conversationId }) => {
    if (!conversationId) return;
    socket.join(conversationId);
    socket.emit('joined_conversation', { conversationId });
  });

  socket.on('chat_message', async (payload) => {
    try {
      const { conversationId, listingId, landlordId, tenantId, message } = payload || {};
      if (!conversationId || !listingId || !landlordId || !tenantId || !message) return;

      // Persist to DB
      const update = {
        $setOnInsert: { conversationId, listingId, landlordId, tenantId },
        $push: { messages: { senderId: message.senderId, senderName: message.senderName, text: message.text, createdAt: new Date() } },
      };
      const opts = { new: true, upsert: true };
      await Conversation.findOneAndUpdate({ listingId, landlordId, tenantId }, update, opts);

      // Broadcast to everyone in the room (including sender for consistency)
      io.to(conversationId).emit('chat_message', {
        ...message,
        conversationId,
        serverTimestamp: Date.now(),
      });
    } catch (e) {
      // swallow socket error; optionally emit error event
    }
  });

  socket.on('typing', ({ conversationId, userId: typingUserId, isTyping }) => {
    if (!conversationId || !typingUserId) return;
    socket.to(conversationId).emit('typing', { conversationId, userId: typingUserId, isTyping: !!isTyping });
  });

  socket.on('disconnect', () => {
    if (userId && userIdToSocketIds.has(userId)) {
      const set = userIdToSocketIds.get(userId);
      set.delete(socket.id);
      if (set.size === 0) userIdToSocketIds.delete(userId);
    }
  });
});


server.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
})
