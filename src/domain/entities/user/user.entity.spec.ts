import { InvalidParamError } from "@/domain/shared/errors/invalid-param-error";
import { UserEntity } from "./user.entity";

describe("User Entity", () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date("2020-01-01"));
  });

  test("should create a new instance of UserEntity with new values", () => {
    const params = { name: "Kelvin" };

    const entity = new UserEntity(params);

    expect(entity.id()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
    expect(entity.createdAt()).toEqual(new Date("2020-01-01"));
    expect(entity.updatedAt()).toEqual(new Date("2020-01-01"));
    expect(entity.getName()).toBe("Kelvin");
    expect(entity.getNotifications()).toEqual([]);
  });

  test("should create a new instance of UserEntity with the same values", () => {
    const params = {
      id: "123",
      name: "Kelvin",
      createdAt: new Date("2024-01-01T10:10:10Z"),
      updatedAt: new Date("2024-01-01T20:20:20Z"),
    };

    const entity = UserEntity.restore(params);

    expect(entity.id()).toBe(params.id);
    expect(entity.createdAt()).toEqual(params.createdAt);
    expect(entity.updatedAt()).toEqual(params.updatedAt);
    expect(entity.getName()).toBe("Kelvin");
  });

  test("should create a new instance of UserEntity with invalid params", () => {
    const params = { name: "Ke" };

    const { user, isValid } = UserEntity.create(params);

    expect(user.id()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
    expect(user.createdAt()).toEqual(new Date("2020-01-01"));
    expect(user.updatedAt()).toEqual(new Date("2020-01-01"));
    expect(user.getName()).toBe("Ke");
    expect(isValid).toBeTruthy();
    expect(user.getNotifications()).toEqual([
      {
        context: "User",
        notification: new InvalidParamError(
          "name",
          `'${params.name}' has less 3 characters`,
        ),
      },
    ]);
    expect(user.getNotificationsMessages()).toEqual([
      "User: Param name 'Ke' has less 3 characters",
    ]);
  });
});
