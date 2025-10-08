import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedConversations() {
  console.log('💬 Seeding conversations and messages...');

  try {
    // Get existing users
    const provider = await prisma.user.findFirst({
      where: { role: 'PROVIDER' }
    });

    const caregivers = await prisma.user.findMany({
      where: { role: 'CAREGIVER' },
      take: 3
    });

    if (!provider || caregivers.length === 0) {
      console.log('⚠️  No provider or caregivers found. Please seed users first.');
      return;
    }

    // Create conversations between provider and each caregiver
    for (const caregiver of caregivers) {
      const participantIds = [provider.id, caregiver.id].sort();
      
      // Check if conversation already exists
      const existing = await prisma.conversation.findFirst({
        where: {
          participantIds: JSON.stringify(participantIds)
        }
      });

      if (existing) {
        console.log(`  ⏭️  Conversation between ${provider.name} and ${caregiver.name} already exists`);
        continue;
      }

      // Create conversation
      const conversation = await prisma.conversation.create({
        data: {
          participantIds: JSON.stringify(participantIds),
          participantNames: JSON.stringify([provider.name, caregiver.name]),
          subject: `Care coordination with ${caregiver.name}`,
          lastMessageAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random time in last 7 days
        }
      });

      // Create some messages in the conversation
      const messages = [
        {
          senderId: provider.id,
          senderName: provider.name,
          senderRole: provider.role,
          content: `Hi ${caregiver.name}, how is the patient doing today?`,
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        },
        {
          senderId: caregiver.id,
          senderName: caregiver.name,
          senderRole: caregiver.role,
          content: `Hello Dr. ${provider.name.split(' ')[1] || provider.name}, the patient is doing well. They took their morning medications on time.`,
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        },
        {
          senderId: provider.id,
          senderName: provider.name,
          senderRole: provider.role,
          content: `That's great to hear! Please keep monitoring their blood pressure and let me know if there are any concerns.`,
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        },
        {
          senderId: caregiver.id,
          senderName: caregiver.name,
          senderRole: caregiver.role,
          content: `Will do! I'll send you the readings this evening.`,
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        },
      ];

      for (const messageData of messages) {
        await prisma.message.create({
          data: {
            conversationId: conversation.id,
            ...messageData,
            messageType: 'TEXT',
            isRead: messageData.senderId === provider.id ? true : Math.random() > 0.5, // Some messages unread
          }
        });
      }

      // Update conversation with last message
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: {
          lastMessageAt: messages[messages.length - 1].createdAt,
          lastMessageText: messages[messages.length - 1].content.substring(0, 100),
        }
      });

      console.log(`  ✅ Created conversation between ${provider.name} and ${caregiver.name} with ${messages.length} messages`);
    }

    console.log('✅ Conversations seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding conversations:', error);
    throw error;
  }
}
