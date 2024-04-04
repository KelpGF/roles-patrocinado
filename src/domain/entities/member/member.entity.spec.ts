import { UserEntity } from "../user/user.entity";
import { MemberEntity } from "./member.entity";

describe("MemberEntity", () => {
  const makeUserEntity = () => UserEntity.create({ name: "Kelvin" }).user;

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date("2020-01-01"));
  });

  test("should create a new instance of MemberEntity with new values", () => {
    const user = makeUserEntity();
    const params = { user };

    const entity = new MemberEntity(params);

    expect(entity.id()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
    expect(entity.createdAt()).toEqual(new Date("2020-01-01"));
    expect(entity.updatedAt()).toEqual(new Date("2020-01-01"));
    expect(entity.getUser()).toEqual(user);
    expect(entity.isGuest()).toBeFalsy();
    expect(entity.isSponsor()).toBeFalsy();
    expect(entity.getSponsorValue()).toBe(0);
    expect(entity.getNotifications()).toEqual([]);
  });

  test("should create a new instance of MemberEntity with the same values", () => {
    const user = makeUserEntity();
    const params = {
      id: "123",
      user,
      createdAt: new Date("2024-01-01T10:10:10Z"),
      updatedAt: new Date("2024-01-01T20:20:20Z"),
    };

    const entity = new MemberEntity(params);

    expect(entity.id()).toBe(params.id);
    expect(entity.createdAt()).toEqual(params.createdAt);
    expect(entity.updatedAt()).toEqual(params.updatedAt);
    expect(entity.getUser()).toEqual(user);
    expect(entity.isGuest()).toBeFalsy();
    expect(entity.isSponsor()).toBeFalsy();
    expect(entity.getNotifications()).toEqual([]);
    expect(entity.getSponsorValue()).toBe(0);
  });
});
