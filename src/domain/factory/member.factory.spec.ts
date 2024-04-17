import {
  GuestMemberEntity,
  CommonMemberEntity,
  SponsorMemberEntity,
  UserEntity,
} from "../entities";
import { Errors } from "../shared/entities/create-entity.type";
import { MembersTypeEnum } from "../shared/enum/members-type.enum";
import MemberFactory from "./member.factory";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "1"),
}));

describe("CommonMemberEntity Factory", () => {
  const makeUserEntity = () =>
    UserEntity.create({ name: "Kelvin" }).value as UserEntity;

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date("2020-01-01"));
  });

  test("should create a new instance of MemberEntity", () => {
    const user = makeUserEntity();
    const params = { user };

    const result = MemberFactory.create(MembersTypeEnum.COMMON, params);
    const member = result.value as CommonMemberEntity;
    const entity = CommonMemberEntity.create(params)
      .value as CommonMemberEntity;

    expect(member).toBeInstanceOf(CommonMemberEntity);
    expect(result.isLeft()).toBe(member.hasNotification);
    expect(result.isRight()).toBe(true);
    expect(member.hasNotification).toBe(false);
    expect(member).toEqual(entity);
  });

  test("should create a new instance of GuestMemberEntity", () => {
    const user = makeUserEntity();
    const params = { user };

    const result = MemberFactory.create(MembersTypeEnum.GUEST, params);
    const member = result.value as GuestMemberEntity;
    const entity = GuestMemberEntity.create(params).value as GuestMemberEntity;

    expect(member).toBeInstanceOf(GuestMemberEntity);
    expect(result.isLeft()).toBe(member.hasNotification);
    expect(result.isRight()).toBe(true);
    expect(member.hasNotification).toBe(false);
    expect(member).toEqual(entity);
  });

  test("should create a new instance of SponsorMemberEntity", () => {
    const user = makeUserEntity();
    const params = { user, sponsoredValue: 100 };

    const result = MemberFactory.create(MembersTypeEnum.SPONSOR, params);
    const member = result.value as SponsorMemberEntity;
    const entity = SponsorMemberEntity.create(params)
      .value as SponsorMemberEntity;

    expect(member).toBeInstanceOf(SponsorMemberEntity);
    expect(result.isLeft()).toBe(member.hasNotification);
    expect(result.isRight()).toBe(true);
    expect(member.hasNotification).toBe(false);
    expect(member).toEqual(entity);
  });

  test("should create a new instance of SponsorMemberEntity with errors", () => {
    const user = makeUserEntity();
    const params = { user, sponsoredValue: 10 };

    const result = MemberFactory.create(MembersTypeEnum.SPONSOR, params);
    const value = result.value as Errors;

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(value).toEqual({
      errors: [
        `Member: Sponsor ${user.name} has a invalid sponsored value "10"`,
      ],
    });
  });
});
