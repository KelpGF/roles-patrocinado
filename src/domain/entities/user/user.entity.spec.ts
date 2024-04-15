import { InvalidParamError } from "@/domain/shared/errors/invalid-param-error";
import { UserEntity } from "./user.entity";

describe("User Entity", () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date("2020-01-01"));
  });

  test("should create a new instance of UserEntity with new values", () => {
    const params = { name: "Kelvin" };

    const result = UserEntity.create(params);

    expect(result.isValid).toBe(true);
    expect(result.user).toBeInstanceOf(UserEntity);
    expect(result.user.id()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
    expect(result.user.createdAt()).toEqual(new Date("2020-01-01"));
    expect(result.user.updatedAt()).toEqual(new Date("2020-01-01"));
    expect(result.user.getName()).toBe("Kelvin");
    expect(result.user.getNotifications()).toEqual([]);
  });

  test("should create a new instance of UserEntity with invalid params", () => {
    const params = { name: "Ke" };

    const { user, isValid } = UserEntity.create(params);

    expect(isValid).toBeFalsy();
    expect(user).toBeInstanceOf(UserEntity);
    expect(user.id()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
    expect(user.createdAt()).toEqual(new Date("2020-01-01"));
    expect(user.updatedAt()).toEqual(new Date("2020-01-01"));
    expect(user.getName()).toBe("Ke");
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

  test("should create a new instance of UserEntity with the same values", () => {
    const params = {
      id: "123",
      name: "Kelvin",
      createdAt: new Date("2024-01-01T10:10:10Z"),
      updatedAt: new Date("2024-01-01T20:20:20Z"),
    };

    const result = UserEntity.restore(params);

    expect(result).toBeInstanceOf(UserEntity);
    expect(result.id()).toBe(params.id);
    expect(result.createdAt()).toEqual(params.createdAt);
    expect(result.updatedAt()).toEqual(params.updatedAt);
    expect(result.getName()).toBe("Kelvin");
  });
});
