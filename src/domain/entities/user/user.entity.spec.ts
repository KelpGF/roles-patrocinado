import { UserEntity } from "./user.entity";
import { Errors } from "@/domain/shared/entities/create-entity.type";

describe("User Entity", () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date("2020-01-01"));
  });

  test("should create a new instance of UserEntity with new values", () => {
    const params = { name: "Kelvin" };

    const result = UserEntity.create(params);
    const user = result.value as UserEntity;

    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(user.hasNotification);
    expect(user).toBeInstanceOf(UserEntity);
    expect(user.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
    expect(user.createdAt).toEqual(new Date("2020-01-01"));
    expect(user.updatedAt).toEqual(new Date("2020-01-01"));
    expect(user.name).toBe("Kelvin");
    expect(user.notifications).toEqual([]);
  });

  test("should return errors when UserEntity is created with invalid params", () => {
    const params = { name: "Ke" };

    const result = UserEntity.create(params);
    const value = result.value as Errors;

    expect(result.isRight()).toBe(false);
    expect(result.isLeft()).toBe(true);
    expect(value).toEqual({
      errors: ["User: Param name 'Ke' has less 3 characters"],
    });
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
    expect(result.id).toBe(params.id);
    expect(result.createdAt).toEqual(params.createdAt);
    expect(result.updatedAt).toEqual(params.updatedAt);
    expect(result.name).toBe("Kelvin");
  });
});
