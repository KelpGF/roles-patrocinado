import { v4 as uuid } from "uuid";
import { BaseEntityAbstract } from "./base-entity.abstract";

describe("BaseEntity", () => {
  class Entity extends BaseEntityAbstract {}

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date("2020-01-01"));
  });

  test("should create a new instance of BaseEntity with new values", () => {
    const entity = new Entity({});

    expect(entity.id()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
    expect(entity.createdAt()).toEqual(new Date("2020-01-01"));
    expect(entity.updatedAt()).toEqual(new Date("2020-01-01"));
  });

  test("should create a new instance of BaseEntity with the same values", () => {
    const params = {
      id: uuid(),
      createdAt: new Date("2024-01-01T10:10:10Z"),
      updatedAt: new Date("2024-01-01T20:20:20Z"),
    };

    const entity = new Entity(params);

    expect(entity.id()).toBe(params.id);
    expect(entity.createdAt()).toEqual(params.createdAt);
    expect(entity.updatedAt()).toEqual(params.updatedAt);
  });

  test("shouldn't has notifications", () => {
    const entity = new Entity({});

    expect(entity.getNotifications()).toEqual([]);
    expect(entity.getNotificationsMessages()).toEqual([]);
    expect(entity.hasNotification()).toBe(false);
  });

  test("should has notifications", () => {
    class OtherEntity extends BaseEntityAbstract {
      constructor() {
        super({});
        this._notification.addNotification({
          context: "Entity",
          message: "Error message",
        });
      }
    }

    const entity = new OtherEntity();

    expect(entity.getNotifications()).toHaveLength(1);
    expect(entity.getNotificationsMessages()).toEqual([
      "Entity: Error message",
    ]);
    expect(entity.hasNotification()).toBe(true);
  });
});
