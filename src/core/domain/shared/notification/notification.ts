import {
  NotificationInterface,
  NotificationItemType,
} from "./notification.interface";

export class Notification implements NotificationInterface {
  private _notifications: NotificationItemType[] = [];

  get notifications(): NotificationItemType[] {
    return this._notifications;
  }

  get hasNotification(): boolean {
    return this._notifications.length > 0;
  }

  get messages(): string[] {
    return this._notifications.map(
      (item) => `${item.context}: ${item.notification.message}`,
    );
  }

  addNotification(notification: NotificationItemType): void {
    this._notifications.push(notification);
  }
}
