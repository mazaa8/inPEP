import { Router } from 'express';
import {
  getConversations,
  getMessages,
  sendMessage,
  createConversation,
  deleteMessage,
} from '../controllers/messageController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get all conversations for current user
router.get('/conversations', getConversations);

// Create new conversation
router.post('/conversations', createConversation);

// Get messages in a conversation
router.get('/conversations/:conversationId/messages', getMessages);

// Send a message
router.post('/messages', sendMessage);

// Delete a message
router.delete('/messages/:id', deleteMessage);

export default router;
