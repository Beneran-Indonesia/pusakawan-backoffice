import { useSyncExternalStore } from "react";

// notificationStore.ts

export type Notification = {
  id: string;
  type: "error" | "progress" | "success";
  message: string;
  description: string;
  createdAt: Date;
  read: boolean;
};

type Listener = (notifications: Notification[]) => void;

let notifications: Notification[] = [];

const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((listener) => {
    listener(notifications);
  });
}

export const notificationStore = {
  getLength() {
    return notifications.length;
  },

  getNotifications() {
    return notifications;
  },

  add(notification: Omit<Notification, "createdAt" | "read">) {
    notifications = [
      {
        ...notification,
        createdAt: new Date(),
        read: false,
      },
      ...notifications,
    ];

    emit();
  },

  markAsRead(id: string) {
    notifications = notifications.map((notification) =>
      notification.id === id ? { ...notification, read: true } : notification,
    );

    emit();
  },

  markAllAsRead() {
    notifications = notifications.map((notification) => ({
      ...notification,
      read: true,
    }));

    emit();
  },

  remove(id: string) {
    notifications = notifications.filter(
      (notification) => notification.id !== id,
    );

    emit();
  },

  subscribe(listener: Listener) {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  },
};

export function useNotifications() {
  useSyncExternalStore(
    notificationStore.subscribe,
    notificationStore.getNotifications,
  );

  return notificationStore;
}
