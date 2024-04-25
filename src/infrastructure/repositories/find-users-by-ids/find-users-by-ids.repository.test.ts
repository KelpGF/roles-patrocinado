import { UserEntity } from "@/domain/entities";
import { UserDAO } from "../../database/DAO/users.dao";
import { FindUserByIdsRepository } from "./find-users-by-ids.repository";
import IdVo from "@/domain/shared/value-object/uuid.vo";
import { PoolClient } from "pg";
import { Database } from "../../database/connection.pg";

describe("FindUsersByIdsRepository", () => {
  let user1: UserEntity;
  let user2: UserEntity;
  let client: PoolClient;

  beforeAll(async () => {
    client = await Database.getInstance();
  });

  afterAll(() => {
    client.release();
    Database.end();
  });

  beforeEach(async () => {
    user1 = UserEntity.restore({
      id: new IdVo().value,
      name: "John Doe",
      createdAt: new Date("2021-01-01"),
      updatedAt: new Date("2021-01-01"),
    });
    user2 = UserEntity.restore({
      id: new IdVo().value,
      name: "Jane Doe",
      createdAt: new Date("2021-01-01"),
      updatedAt: new Date("2021-01-01"),
    });

    await client.query(
      "INSERT INTO users (id, name, created_at, updated_at) VALUES ($1, $2, $3, $4), ($5, $6, $7, $8)",
      [
        user1.id,
        user1.name,
        user1.createdAt,
        user1.updatedAt,
        user2.id,
        user2.name,
        user2.createdAt,
        user2.updatedAt,
      ],
    );
  });
  afterEach(async () => {
    await client.query("DELETE FROM users WHERE id = ANY($1)", [
      [user1.id, user2.id],
    ]);
  });

  test("should return a list of users", async () => {
    const userDAO = new UserDAO(client);
    const userRepo = new FindUserByIdsRepository(userDAO);
    const userIds = [user1.id, user2.id];

    const users = await userRepo.create({ userIds });

    expect(users).toEqual([user1, user2]);
  });

  test("should return an empty list if DAO throws an error", async () => {
    const userRepo = new FindUserByIdsRepository({
      inList: jest
        .fn()
        .mockRejectedValue(new Error("Failed to connect to database")),
    });
    const userIds = [new IdVo().value, new IdVo().value];

    const users = await userRepo.create({ userIds });

    expect(users).toEqual([]);
  });
});
