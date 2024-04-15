import {
  GuestMemberEntity,
  MemberEntity,
  SponsorMemberEntity,
  UserEntity,
} from "../entities";
import { MembersTypeEnum } from "../shared/enum/members-type.enum";
import MemberFactory from "./member.factory";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "1"),
}));

describe("MemberEntity Factory", () => {
  const makeUserEntity = () => UserEntity.create({ name: "Kelvin" }).user;

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date("2020-01-01"));
  });

  test("should create a new instance of MemberEntity", () => {
    const user = makeUserEntity();
    const params = { user };

    const { member, isValid } = MemberFactory.create(
      MembersTypeEnum.Member,
      params,
    );
    const entity = new MemberEntity(params);

    expect(member).toBeInstanceOf(MemberEntity);
    expect(isValid).toBe(!member.hasNotification());
    expect(isValid).toBe(true);
    expect(member.hasNotification()).toBe(false);
    expect(member).toEqual(entity);
  });

  test("should create a new instance of GuestMemberEntity", () => {
    const user = makeUserEntity();
    const params = { user };

    const { member, isValid } = MemberFactory.create(
      MembersTypeEnum.Guest,
      params,
    );
    const entity = new GuestMemberEntity(params);

    expect(member).toBeInstanceOf(GuestMemberEntity);
    expect(isValid).toBe(!member.hasNotification());
    expect(isValid).toBe(true);
    expect(member.hasNotification()).toBe(false);
    expect(member).toEqual(entity);
  });

  test("should create a new instance of SponsorMemberEntity", () => {
    const user = makeUserEntity();
    const params = { user, sponsoredValue: 100 };

    const { member, isValid } = MemberFactory.create(
      MembersTypeEnum.Sponsor,
      params,
    );
    const entity = new SponsorMemberEntity(params);

    expect(member).toBeInstanceOf(SponsorMemberEntity);
    expect(isValid).toBe(!member.hasNotification());
    expect(isValid).toBe(true);
    expect(member.hasNotification()).toBe(false);
    expect(member).toEqual(entity);
  });

  test("should create a new instance of SponsorMemberEntity with errors", () => {
    const user = makeUserEntity();
    const params = { user, sponsoredValue: 10 };

    const { member, isValid } = MemberFactory.create(
      MembersTypeEnum.Sponsor,
      params,
    );
    const entity = new SponsorMemberEntity(params);

    expect(member).toBeInstanceOf(SponsorMemberEntity);
    expect(isValid).toBe(!member.hasNotification());
    expect(isValid).toBe(false);
    expect(member.hasNotification()).toBe(true);
    expect(member).toEqual(entity);
  });
});
