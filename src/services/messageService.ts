import { apiRequest } from '../config/api';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  content: string;
  messageType: 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM';
  attachmentUrl?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  participantNames: string[];
  subject?: string;
  lastMessageAt: string;
  lastMessageText?: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  messages?: Message[];
  otherParticipants?: Array<{ id: string; name: string }>;
  unreadCount?: number;
}

export interface CreateConversationData {
  participantIds: string[];
  subject?: string;
  initialMessage?: string;
}

export interface SendMessageData {
  conversationId: string;
  content: string;
  messageType?: 'TEXT' | 'IMAGE' | 'FILE';
  attachmentUrl?: string;
}

export const messageService = {
  // Get all conversations for current user
  getConversations: async (): Promise<Conversation[]> => {
    return apiRequest<Conversation[]>('/messages/conversations', {
      method: 'GET',
    });
  },

  // Get messages in a conversation
  getMessages: async (conversationId: string): Promise<Message[]> => {
    return apiRequest<Message[]>(`/messages/conversations/${conversationId}/messages`, {
      method: 'GET',
    });
  },

  // Create a new conversation
  createConversation: async (data: CreateConversationData): Promise<Conversation> => {
    return apiRequest<Conversation>('/messages/conversations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Send a message
  sendMessage: async (data: SendMessageData): Promise<Message> => {
    return apiRequest<Message>('/messages/messages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Delete a message
  deleteMessage: async (id: string): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/messages/messages/${id}`, {
      method: 'DELETE',
    });
  },
};
