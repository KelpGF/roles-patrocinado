import { PoolClient } from "pg";
import { MemberDAOProtocol } from "../protocols/member.dao.protocol";
import { OutingDAOProtocol } from "../protocols/outing.dao.protocol";
import { Database } from "@/infrastructure/database/connection.pg";
import { MemberDAO } from "@/infrastructure/database/DAO/member.dao";
import { OutingDAO } from "@/infrastructure/database/DAO/outing.dao";
import MemberEntityAbstract from "@/domain/entities/member/member.entity.abstract";
import MemberFactory from "@/domain/factory/member.factory";
import { MembersTypeEnum } from "@/domain/shared/enum/members-type.enum";
import { OutingEntity, UserEntity } from "@/domain/entities";
import IdVo from "@/domain/shared/value-object/uuid.vo";
import { CreateOutingRepositoryProtocol } from "@/application/protocols/create-outing.repository.protocol";
import { CreateOutingRepository } from "./create-outing.repository";
import { InfraError } from "@/domain/shared/errors";

describe("CreateOutingRepository", () => {
  let client: PoolClient;
  let memberDAO: MemberDAOProtocol;
  let outingDAO: OutingDAOProtocol;
  let sut: CreateOutingRepositoryProtocol;

  let member1: MemberEntityAbstract;
  let member2: MemberEntityAbstract;
  let member3: MemberEntityAbstract;
  let outing: OutingEntity;

  beforeAll(async () => {
    client = await Database.getInstance();
    memberDAO = new MemberDAO(client);
    outingDAO = new OutingDAO(client);
    sut = new CreateOutingRepository(memberDAO, outingDAO);
  });
  afterAll(() => {
    client.release();
    Database.end();
  });

  beforeEach(async () => {
    member1 = MemberFactory.restore(MembersTypeEnum.COMMON, {
      id: new IdVo().value,
      user: UserEntity.restore({
        id: new IdVo().value,
        name: "John Doe",
        createdAt: new Date("2021-01-01"),
        updatedAt: new Date("2021-01-01"),
      }),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    member2 = MemberFactory.restore(MembersTypeEnum.GUEST, {
      id: new IdVo().value,
      user: UserEntity.restore({
        id: new IdVo().value,
        name: "Jane Doe",
        createdAt: new Date("2021-01-01"),
        updatedAt: new Date("2021-01-01"),
      }),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    member3 = MemberFactory.restore(MembersTypeEnum.SPONSOR, {
      id: new IdVo().value,
      user: UserEntity.restore({
        id: new IdVo().value,
        name: "John Doe",
        createdAt: new Date("2021-01-01"),
        updatedAt: new Date("2021-01-01"),
      }),
      sponsoredValue: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    outing = OutingEntity.restore({
      id: new IdVo().value,
      placeName: "cinema",
      date: new Date("2021-01-01"),
      serviceFee: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
      members: [member1, member2, member3],
    });
  });
  afterEach(async () => {
    await client.query("DELETE FROM members WHERE id = ANY($1)", [
      [member1.id, member2.id, member3.id],
    ]);
    await client.query("DELETE FROM outings WHERE id = $1", [outing.id]);
  });
  test("should create an outing", async () => {
    const result = await sut.create({ outing });
    const outingResult = await client.query(
      "SELECT * FROM outings WHERE id = $1",
      [outing.id],
    );
    const membersResult = await client.query(
      "SELECT * FROM members WHERE outing_id = $1",
      [outing.id],
    );

    expect(result.isRight()).toBeTruthy();
    expect(outingResult.rows.length).toBe(1);
    expect(outingResult.rows[0].id).toBe(outing.id);
    expect(membersResult.rows.length).toBe(3);
    expect(membersResult.rows[0].id).toBe(member1.id);
    expect(membersResult.rows[1].id).toBe(member2.id);
    expect(membersResult.rows[2].id).toBe(member3.id);
  });

  test("should return an infra error", async () => {
    const error = new Error("any_error");
    jest.spyOn(outingDAO, "insertOne").mockRejectedValueOnce(error);
    const result = await sut.create({ outing });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toEqual(
      new InfraError(`Error on create outing: ${error.message}`),
    );
  });
});
