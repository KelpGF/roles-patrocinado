import { DomainError } from "@/domain/shared/errors";
import { UserEntity } from "../user/user.entity";
import { SponsorMemberEntity } from "./sponsor-member.entity";
import { Errors } from "@/domain/shared/entities/create-entity.type";
import { MembersTypeEnum } from "@/domain/shared/enum/members-type.enum";

describe("SponsorMemberEntity", () => {
  const makeUserEntity = () =>
    UserEntity.create({ name: "Kelvin" }).value as UserEntity;

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date("2020-01-01"));
  });

  test("should create a new instance of SponsorMemberEntity with new values", () => {
    const user = makeUserEntity();
    const params = { user, sponsoredValue: 100 };

    const result = SponsorMemberEntity.create(params);
    const entity = result.value as SponsorMemberEntity;

    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(user.hasNotification);
    expect(entity.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
    expect(entity.createdAt).toEqual(new Date("2020-01-01"));
    expect(entity.updatedAt).toEqual(new Date("2020-01-01"));
    expect(entity.user).toEqual(user);
    expect(entity.isGuest).toBeFalsy();
    expect(entity.isSponsor).toBeTruthy();
    expect(entity.isSponsor).toBeTruthy();
    expect(entity.type).toBe(MembersTypeEnum.SPONSOR);
    expect(entity.notifications).toEqual([]);
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

    const result = SponsorMemberEntity.create(params);
    const entity = result.value as SponsorMemberEntity;

    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(user.hasNotification);
    expect(entity.id).toBe(params.id);
    expect(entity.createdAt).toEqual(params.createdAt);
    expect(entity.updatedAt).toEqual(params.updatedAt);
    expect(entity.user).toEqual(user);
    expect(entity.isGuest).toBeFalsy();
    expect(entity.isSponsor).toBeTruthy();
    expect(entity.sponsorValue).toBe(params.sponsoredValue);
    expect(entity.type).toBe(MembersTypeEnum.SPONSOR);
    expect(entity.notifications).toEqual([]);
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
    const result = SponsorMemberEntity.create(params);
    const value = result.value as Errors;

    expect(value).toEqual({
      errors: [
        new DomainError(
          `Member: Sponsor ${user.name} has a invalid sponsored value "10"`,
        ),
      ],
    });
  });

  test("should change the sponsor value", () => {
    const user = makeUserEntity();
    const params = { user, sponsoredValue: 100 };

    const entity = SponsorMemberEntity.create(params)
      .value as SponsorMemberEntity;
    expect(entity.sponsorValue).toBe(100);
    expect(entity.notifications).toEqual([]);

    entity.changeSponsorValue(50);
    expect(entity.sponsorValue).toBe(50);
    expect(entity.notifications).toEqual([]);

    entity.changeSponsorValue(0);
    expect(entity.sponsorValue).toBe(0);
    expect(entity.notifications).toEqual([
      {
        context: "Member",
        notification: new DomainError(
          `Sponsor ${user.name} has a invalid sponsored value "0"`,
        ),
      },
    ]);
  });
});
