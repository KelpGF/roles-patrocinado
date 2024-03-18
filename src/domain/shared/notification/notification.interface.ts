export type NotificationItemType = {
  context: string;
  message: string;
};

export interface NotificationInterface {
  hasNotification(): boolean;
  addNotification(notification: NotificationItemType): void;
  getMessages(): string[];
  getNotifications(): NotificationItemType[];
}
