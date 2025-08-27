import { useState, useEffect } from 'react';

export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notification');
      return;
    }
    const status = await Notification.requestPermission();
    setPermission(status);
    return status;
  };

  const scheduleNotification = (title: string, options: NotificationOptions, eventTime: Date) => {
    if (permission !== 'granted') {
      alert('Please grant permission for notifications first.');
      return;
    }

    const now = new Date().getTime();
    const alertTime = eventTime.getTime() - 15 * 60 * 1000; // 15 minutes before
    const delay = alertTime - now;

    if (delay > 0) {
      setTimeout(() => {
        new Notification(title, options);
      }, delay);
      alert(`Alert set for "${title}" 15 minutes before the event.`);
    } else {
      alert('This event has already passed or is less than 15 minutes away.');
    }
  };

  return { requestPermission, scheduleNotification, permission };
};
