/**
 * Notification Service
 * Handles in-app notifications for journal events and other activities
 */

export interface Notification {
  id: string;
  userId: string;
  type: 'journal_shared' | 'journal_reviewed' | 'critical_event' | 'ai_alert' | 'general';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'success';
  isRead: boolean;
  createdAt: string;
  relatedEntityId?: string; // Journal entry ID, etc.
  relatedEntityType?: 'journal' | 'appointment' | 'medication' | 'other';
  actionUrl?: string; // Where to navigate when clicked
}

// Mock data for demonstration
const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'provider-1',
    type: 'journal_shared',
    title: 'New Journal Entry Shared',
    message: 'Sarah Johnson shared a seizure event entry',
    severity: 'warning',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
    relatedEntityId: 'entry-123',
    relatedEntityType: 'journal',
    actionUrl: '/provider/journal-review',
  },
  {
    id: 'notif-2',
    userId: 'provider-1',
    type: 'critical_event',
    title: 'Critical Event Alert',
    message: 'Patient John Doe had a fall - immediate attention required',
    severity: 'error',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    relatedEntityId: 'entry-124',
    relatedEntityType: 'journal',
    actionUrl: '/provider/journal-review',
  },
  {
    id: 'notif-3',
    userId: 'provider-1',
    type: 'ai_alert',
    title: 'AI Pattern Detected',
    message: 'Increased seizure frequency detected for Sarah Johnson (3 in 2 weeks)',
    severity: 'warning',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    relatedEntityId: 'patient-123',
    relatedEntityType: 'other',
    actionUrl: '/provider/ai-adherence',
  },
  {
    id: 'notif-4',
    userId: 'provider-1',
    type: 'journal_shared',
    title: 'Multiple Entries Shared',
    message: 'Caregiver shared 3 new journal entries for review',
    severity: 'info',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    relatedEntityId: 'batch-1',
    relatedEntityType: 'journal',
    actionUrl: '/provider/journal-review',
  },
  {
    id: 'notif-5',
    userId: 'provider-1',
    type: 'general',
    title: 'Weekly Summary Available',
    message: 'Your weekly patient summary report is ready to view',
    severity: 'success',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    actionUrl: '/provider/dashboard',
  },
];

class NotificationService {
  private notifications: Notification[] = [...mockNotifications];

  /**
   * Get all notifications for a user
   */
  async getNotifications(userId: string): Promise<Notification[]> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // For demo purposes, show notifications for any provider user
    // In production, this would filter by actual userId
    const userNotifications = this.notifications.filter(n => n.userId === userId);
    
    // If no notifications for this user, return mock data for demo
    if (userNotifications.length === 0) {
      // Update mock notifications to use current userId
      this.notifications = this.notifications.map(n => ({ ...n, userId }));
      return this.notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    
    return userNotifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(userId: string): Promise<number> {
    const notifications = await this.getNotifications(userId);
    return notifications.filter(n => !n.isRead).length;
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    this.notifications
      .filter(n => n.userId === userId)
      .forEach(n => n.isRead = true);
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
  }

  /**
   * Create new notification (for testing)
   */
  async createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    
    this.notifications.unshift(newNotification);
    return newNotification;
  }

  /**
   * Get notifications by type
   */
  async getNotificationsByType(userId: string, type: Notification['type']): Promise<Notification[]> {
    const all = await this.getNotifications(userId);
    return all.filter(n => n.type === type);
  }

  /**
   * Get unread notifications only
   */
  async getUnreadNotifications(userId: string): Promise<Notification[]> {
    const all = await this.getNotifications(userId);
    return all.filter(n => !n.isRead);
  }
}

// Export singleton instance
export const notificationService = new NotificationService();

/**
 * Helper function to format relative time
 */
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString();
}

/**
 * Get severity color
 */
export function getSeverityColor(severity: Notification['severity']): string {
  const colors = {
    info: '#2196f3',
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
  };
  return colors[severity];
}

/**
 * Get notification icon
 */
export function getNotificationIcon(type: Notification['type']): string {
  const icons = {
    journal_shared: '📖',
    journal_reviewed: '✅',
    critical_event: '🚨',
    ai_alert: '🤖',
    general: '📢',
  };
  return icons[type];
}
