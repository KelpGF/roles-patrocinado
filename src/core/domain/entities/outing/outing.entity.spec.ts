import { MembersTypeEnum } from "@/domain/shared/enum/members-type.enum";
import { OutingEntity } from "./outing.entity";
import { UserEntity } from "../user/user.entity";
import MemberFactory from "@/domain/factory/member.factory";
import MemberEntityAbstract from "../member/member.entity.abstract";
import { Errors } from "@/domain/shared/entities/create-entity.type";
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
    const entity = result.value as OutingEntity;

    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(entity.hasNotification);
    expect(entity).toBeInstanceOf(OutingEntity);
    expect(entity.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
    expect(entity.placeName).toBe(params.placeName);
    expect(entity.serviceFee).toBe(params.serviceFee);
    expect(entity.date).toEqual(params.date);
    expect(entity.members).toEqual([]);
    expect(entity.notifications).toEqual([]);
    expect(entity.createdAt).toEqual(new Date("2020-01-01"));
    expect(entity.updatedAt).toEqual(new Date("2020-01-01"));
  });

  test("should create a new instance with invalid values", () => {
    const params = {
      placeName: "Park",
      serviceFee: -1,
      date: new Date("2024-01-10T10:10:10Z"),
      members: [
        {
          type: MembersTypeEnum.SPONSOR,
          data: {
            user: UserEntity.create({ name: "Kelps" }).value as UserEntity,
          },
        },
      ],
    };

    const result = OutingEntity.create(params);
    const value = result.value as Errors;

    expect(result.isRight()).toBe(false);
    expect(result.isLeft()).toBe(true);
    expect(value).toEqual({
      errors: [
        new DomainError(
          'Outing: Member: Sponsor Kelps has a invalid sponsored value "0"',
        ),
        new DomainError(
          'Outing: Param Place name "Park" must have at least 5 characters',
        ),
        new DomainError("Outing: Param Service fee is invalid"),
      ],
    });
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
        MemberFactory.create(MembersTypeEnum.COMMON, {
          user: UserEntity.create({ name: "Kelvin" }).value as UserEntity,
        }).value as MemberEntityAbstract,
        MemberFactory.create(MembersTypeEnum.GUEST, {
          user: UserEntity.create({ name: "Kelv" }).value as UserEntity,
        }).value as MemberEntityAbstract,
        MemberFactory.create(MembersTypeEnum.SPONSOR, {
          user: UserEntity.create({ name: "Kelps" }).value as UserEntity,
          sponsoredValue: 100,
        }).value as MemberEntityAbstract,
      ],
    };

    const outing = OutingEntity.restore(params);

    expect(outing).toBeInstanceOf(OutingEntity);
    expect(outing.id).toBe(params.id);
    expect(outing.placeName).toBe(params.placeName);
    expect(outing.serviceFee).toBe(params.serviceFee);
    expect(outing.date).toEqual(params.date);
    expect(outing.members).toEqual(params.members);
    expect(outing.createdAt).toEqual(params.createdAt);
    expect(outing.updatedAt).toEqual(params.updatedAt);
  });
});
