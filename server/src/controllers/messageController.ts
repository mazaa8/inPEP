import { Response } from 'express';
import prisma from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { AuthRequest } from '../types/index.js';

// Get all conversations for current user
export const getConversations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        participantIds: {
          contains: req.user.id,
        },
      },
      include: {
        messages: {
          take: 1,
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        lastMessageAt: 'desc',
      },
    });

    // Parse JSON fields and add metadata
    const formattedConversations = conversations.map((conv) => {
      const participantIds = JSON.parse(conv.participantIds);
      const participantNames = JSON.parse(conv.participantNames);
      
      // Get the other participant(s)
      const otherParticipants = participantIds
        .map((id: string, index: number) => ({
          id,
          name: participantNames[index],
        }))
        .filter((p: any) => p.id !== req.user!.id);

      return {
        ...conv,
        participantIds,
        participantNames,
        otherParticipants,
        unreadCount: conv.messages.filter((m) => !m.isRead && m.senderId !== req.user!.id).length,
      };
    });

    res.status(200).json(formattedConversations);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error('Get conversations error:', error);
      res.status(500).json({ error: 'Failed to fetch conversations' });
    }
  }
};

// Get messages in a conversation
export const getMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { conversationId } = req.params;

    // Verify user is part of conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new AppError('Conversation not found', 404);
    }

    const participantIds = JSON.parse(conversation.participantIds);
    if (!participantIds.includes(req.user.id)) {
      throw new AppError('Access denied', 403);
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: req.user.id },
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    res.status(200).json(messages);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error('Get messages error:', error);
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  }
};

// Send a message
export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { conversationId, content, messageType, attachmentUrl } = req.body;

    if (!conversationId || !content) {
      throw new AppError('Missing required fields', 400);
    }

    // Verify user is part of conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new AppError('Conversation not found', 404);
    }

    const participantIds = JSON.parse(conversation.participantIds);
    if (!participantIds.includes(req.user.id)) {
      throw new AppError('Access denied', 403);
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: req.user.id,
        senderName: req.user.name,
        senderRole: req.user.role,
        content,
        messageType: messageType || 'TEXT',
        attachmentUrl,
      },
    });

    // Update conversation
    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessageAt: new Date(),
        lastMessageText: content.substring(0, 100),
      },
    });

    res.status(201).json(message);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error('Send message error:', error);
      res.status(500).json({ error: 'Failed to send message' });
    }
  }
};

// Create a new conversation
export const createConversation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { participantIds, subject, initialMessage } = req.body;

    if (!participantIds || participantIds.length < 2) {
      throw new AppError('At least 2 participants required', 400);
    }

    // Verify current user is in participants
    if (!participantIds.includes(req.user.id)) {
      participantIds.push(req.user.id);
    }

    // Get participant names
    const participants = await prisma.user.findMany({
      where: {
        id: { in: participantIds },
      },
      select: {
        id: true,
        name: true,
      },
    });

    const participantNames = participantIds.map(
      (id: string) => participants.find((p) => p.id === id)?.name || 'Unknown'
    );

    // Check if conversation already exists between these users
    const existingConversations = await prisma.conversation.findMany({
      where: {
        participantIds: {
          equals: JSON.stringify(participantIds.sort()),
        },
      },
    });

    if (existingConversations.length > 0) {
      res.status(200).json(existingConversations[0]);
      return;
    }

    // Create conversation
    const conversation = await prisma.conversation.create({
      data: {
        participantIds: JSON.stringify(participantIds),
        participantNames: JSON.stringify(participantNames),
        subject,
      },
    });

    // Send initial message if provided
    if (initialMessage) {
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          senderId: req.user.id,
          senderName: req.user.name,
          senderRole: req.user.role,
          content: initialMessage,
          messageType: 'TEXT',
        },
      });

      await prisma.conversation.update({
        where: { id: conversation.id },
        data: {
          lastMessageAt: new Date(),
          lastMessageText: initialMessage.substring(0, 100),
        },
      });
    }

    res.status(201).json(conversation);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error('Create conversation error:', error);
      res.status(500).json({ error: 'Failed to create conversation' });
    }
  }
};

// Delete a message
export const deleteMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { id } = req.params;

    const message = await prisma.message.findUnique({
      where: { id },
    });

    if (!message) {
      throw new AppError('Message not found', 404);
    }

    if (message.senderId !== req.user.id) {
      throw new AppError('Access denied', 403);
    }

    await prisma.message.delete({
      where: { id },
    });

    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error('Delete message error:', error);
      res.status(500).json({ error: 'Failed to delete message' });
    }
  }
};
