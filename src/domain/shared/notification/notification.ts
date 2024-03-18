import {
  NotificationInterface,
  NotificationItemType,
} from "./notification.interface";

export class Notification implements NotificationInterface {
  private notifications: NotificationItemType[] = [];

  hasNotification(): boolean {
    return this.notifications.length > 0;
  }

  addNotification(notification: NotificationItemType): void {
    this.notifications.push(notification);
  }

  getMessages(): string[] {
    return this.notifications.map(
      (notification) => `${notification.context}: ${notification.message}`,
    );
  }

  getNotifications(): NotificationItemType[] {
    return this.notifications;
  }
}
