export type NotificationItemType = {
  context: string;
  notification: Error;
};

export interface NotificationInterface {
  hasNotification(): boolean;
  addNotification(notification: NotificationItemType): void;
  getMessages(): string[];
  getNotifications(): NotificationItemType[];
}
