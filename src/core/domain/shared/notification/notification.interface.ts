export type NotificationItemType = {
  context: string;
  notification: Error;
};

export interface NotificationInterface {
  addNotification(notification: NotificationItemType): void;
  messages: string[];
  notifications: NotificationItemType[];
  hasNotification: boolean;
}
