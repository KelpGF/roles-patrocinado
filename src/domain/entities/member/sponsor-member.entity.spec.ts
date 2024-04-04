import { DomainError } from "@/domain/shared/errors";
import { UserEntity } from "../user/user.entity";
import { SponsorMemberEntity } from "./sponsor-member.entity";

describe("SponsorMemberEntity", () => {
  const makeUserEntity = () => UserEntity.create({ name: "Kelvin" }).user;

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date("2020-01-01"));
  });

  test("should create a new instance of SponsorMemberEntity with new values", () => {
    const user = makeUserEntity();
    const params = { user, sponsoredValue: 100 };

    const entity = new SponsorMemberEntity(params);

    expect(entity.id()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
    expect(entity.createdAt()).toEqual(new Date("2020-01-01"));
    expect(entity.updatedAt()).toEqual(new Date("2020-01-01"));
    expect(entity.getUser()).toEqual(user);
    expect(entity.isGuest()).toBeFalsy();
    expect(entity.isSponsor()).toBeTruthy();
    expect(entity.getSponsorValue()).toBe(params.sponsoredValue);
    expect(entity.getNotifications()).toEqual([]);
  });

  test("should create a new instance of SponsorMemberEntity with the same values", () => {
    const user = makeUserEntity();
    const params = {
      id: "123",
      user,
      createdAt: new Date("2024-01-01T10:10:10Z"),
      updatedAt: new Date("2024-01-01T20:20:20Z"),
      sponsoredValue: 100,
    };

    const entity = new SponsorMemberEntity(params);

    expect(entity.id()).toBe(params.id);
    expect(entity.createdAt()).toEqual(params.createdAt);
    expect(entity.updatedAt()).toEqual(params.updatedAt);
    expect(entity.getUser()).toEqual(user);
    expect(entity.isGuest()).toBeFalsy();
    expect(entity.isSponsor()).toBeTruthy();
    expect(entity.getSponsorValue()).toBe(params.sponsoredValue);
    expect(entity.getNotifications()).toEqual([]);
  });

  test("should create a new instance of SponsorMemberEntity with notifications", () => {
    const user = makeUserEntity();
    const params = {
      id: "123",
      user,
      createdAt: new Date("2024-01-01T10:10:10Z"),
      updatedAt: new Date("2024-01-01T20:20:20Z"),
      sponsoredValue: 10,
    };

    const entity = new SponsorMemberEntity(params);

    expect(entity.id()).toBe(params.id);
    expect(entity.createdAt()).toEqual(params.createdAt);
    expect(entity.updatedAt()).toEqual(params.updatedAt);
    expect(entity.getUser()).toEqual(user);
    expect(entity.isGuest()).toBeFalsy();
    expect(entity.isSponsor()).toBeTruthy();
    expect(entity.getSponsorValue()).toBe(params.sponsoredValue);
    expect(entity.getNotifications()).toEqual([
      {
        context: "Member",
        notification: new DomainError(
          `Member ${user.getName()} has a invalid sponsored value: "${params.sponsoredValue}"`,
        ),
      },
    ]);
  });

  test("should change the sponsor value", () => {
    const user = makeUserEntity();
    const params = { user, sponsoredValue: 100 };

    const entity = new SponsorMemberEntity(params);
    expect(entity.getSponsorValue()).toBe(100);
    expect(entity.getNotifications()).toEqual([]);

    entity.changeSponsorValue(50);
    expect(entity.getSponsorValue()).toBe(50);
    expect(entity.getNotifications()).toEqual([]);

    entity.changeSponsorValue(0);
    expect(entity.getSponsorValue()).toBe(0);
    expect(entity.getNotifications()).toEqual([
      {
        context: "Member",
        notification: new DomainError(
          `Member ${user.getName()} has a invalid sponsored value: "0"`,
        ),
      },
    ]);
  });
});
