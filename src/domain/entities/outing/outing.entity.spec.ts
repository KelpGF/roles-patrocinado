import { MembersTypeEnum } from "@/domain/shared/enum/members-type.enum";
import { OutingEntity } from "./outing.entity";
import { UserEntity } from "../user/user.entity";
import MemberFactory from "@/domain/factory/member.factory";
import { DomainError } from "@/domain/shared/errors";

describe("OutingEntity", () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date("2020-01-01"));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should create a new instance with new values", () => {
    const params = {
      placeName: "Restaurant",
      serviceFee: 10,
      date: new Date(),
    };

    const result = OutingEntity.create(params);

    expect(result.isValid).toBe(true);
    expect(result.outgoing).toBeInstanceOf(OutingEntity);
    expect(result.outgoing.id()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
    expect(result.outgoing.getPlaceName()).toBe(params.placeName);
    expect(result.outgoing.getServiceFee()).toBe(params.serviceFee);
    expect(result.outgoing.getDate()).toEqual(params.date);
    expect(result.outgoing.getMembers()).toEqual([]);
    expect(result.outgoing.getNotifications()).toEqual([]);
    expect(result.outgoing.createdAt()).toEqual(new Date("2020-01-01"));
    expect(result.outgoing.updatedAt()).toEqual(new Date("2020-01-01"));
  });

  test("should create a new instance with invalid values", () => {
    const params = {
      id: "123",
      placeName: "Park",
      serviceFee: 10,
      date: new Date("2024-01-10T10:10:10Z"),
      createdAt: new Date("2024-01-01T10:10:10Z"),
      updatedAt: new Date("2024-01-01T20:20:20Z"),
      members: [
        {
          type: MembersTypeEnum.Member,
          data: { user: UserEntity.create({ name: "Kelvin" }).user },
        },
        {
          type: MembersTypeEnum.Guest,
          data: { user: UserEntity.create({ name: "Jelps" }).user },
        },
        {
          type: MembersTypeEnum.Sponsor,
          data: {
            user: UserEntity.create({ name: "Kelps" }).user,
          },
        },
      ],
    };

    const result = OutingEntity.create(params);
    const members = result.outgoing.getMembers();

    expect(result.outgoing).toBeInstanceOf(OutingEntity);
    expect(result.outgoing.id()).toBe(params.id);
    expect(result.outgoing.getPlaceName()).toBe(params.placeName);
    expect(result.outgoing.getServiceFee()).toBe(params.serviceFee);
    expect(result.outgoing.getDate()).toEqual(params.date);

    expect(members.length).toBe(3);
    expect(members[0].getUser()).toEqual(params.members[0].data.user);
    expect(members[1].getUser()).toEqual(params.members[1].data.user);
    expect(members[2].getUser()).toEqual(params.members[2].data.user);

    expect(result.isValid).toBeFalsy();
    expect(result.outgoing.getNotifications()).toEqual([
      {
        context: "Outing",
        notification: new DomainError(
          `Param Place name "Park" must have at least 5 characters`,
        ),
      },
      {
        context: "Outing",
        notification: new DomainError(
          `Member Kelps has a invalid sponsored value: "undefined"`,
        ),
      },
    ]);
  });

  test("should create a new instance with the same values", () => {
    const params = {
      id: "123",
      placeName: "Park",
      serviceFee: 10,
      date: new Date(),
      createdAt: new Date("2024-01-01T10:10:10Z"),
      updatedAt: new Date("2024-01-01T20:20:20Z"),
      members: [
        MemberFactory.create(MembersTypeEnum.Member, {
          user: UserEntity.create({ name: "Kelvin" }).user,
        }).member,
        MemberFactory.create(MembersTypeEnum.Guest, {
          user: UserEntity.create({ name: "Kelv" }).user,
        }).member,
        MemberFactory.create(MembersTypeEnum.Sponsor, {
          user: UserEntity.create({ name: "Kelps" }).user,
          sponsoredValue: 100,
        }).member,
      ],
    };

    const outgoing = OutingEntity.restore(params);

    expect(outgoing).toBeInstanceOf(OutingEntity);
    expect(outgoing.id()).toBe(params.id);
    expect(outgoing.getPlaceName()).toBe(params.placeName);
    expect(outgoing.getServiceFee()).toBe(params.serviceFee);
    expect(outgoing.getDate()).toEqual(params.date);
    expect(outgoing.createdAt()).toEqual(params.createdAt);
    expect(outgoing.updatedAt()).toEqual(params.updatedAt);
    expect(outgoing.getMembers()).toEqual(params.members);
  });
});
