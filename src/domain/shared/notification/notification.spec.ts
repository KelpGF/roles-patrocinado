import { Notification } from "./notification";

describe("Notification", () => {
  test("should create a new instance of Notification with no messages", () => {
    const notification = new Notification();

    expect(notification.hasNotification()).toBe(false);
    expect(notification.getMessages()).toEqual([]);
    expect(notification.getNotifications()).toEqual([]);
  });

  test("should add a new message to the notification", () => {
    const notification = new Notification();
    const message = "A new message";

    notification.addNotification({
      context: "context",
      message,
    });

    expect(notification.hasNotification()).toBe(true);
    expect(notification.getMessages()).toEqual(["context: A new message"]);
    expect(notification.getNotifications()).toEqual([
      { context: "context", message },
    ]);
  });

  test("should add multiple messages to the notification", () => {
    const notification = new Notification();

    notification.addNotification({
      context: "context",
      message: "A new message",
    });
    notification.addNotification({
      context: "context1",
      message: "Another message",
    });

    expect(notification.hasNotification()).toBe(true);
    expect(notification.getMessages()).toEqual([
      "context: A new message",
      "context1: Another message",
    ]);
    expect(notification.getNotifications()).toEqual([
      { context: "context", message: "A new message" },
      { context: "context1", message: "Another message" },
    ]);
  });
});
