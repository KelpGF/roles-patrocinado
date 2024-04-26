import { InsertManyMemberDAOProtocol } from "@/infrastructure/repositories/protocols/member-insert.dao.protocol";
import { PoolClient } from "pg";

export class MemberDAO implements InsertManyMemberDAOProtocol {
  constructor(private readonly client: PoolClient) {}

  // TODO: refactor
  async insertMany({
    members,
    dbContext = this.client,
  }: InsertManyMemberDAOProtocol.Input): Promise<void> {
    const queryStringValues = Array.from(
      { length: members.length },
      (_, i) =>
        `($${i * 8 + 1}, $${i * 8 + 2}, $${i * 8 + 3}, $${i * 8 + 4}, $${i * 8 + 5}, $${i * 8 + 6}, $${i * 8 + 7}, $${i * 8 + 8})`,
    ).join(", ");
    const queryValues = members.map((member) => [
      member.id,
      member.outingId,
      member.userId,
      member.isGuest,
      member.isSponsor,
      member.sponsorValue,
      member.createdAt,
      member.updatedAt,
    ]);

    const query = `INSERT INTO members (id, outing_id, user_id, is_guest, is_sponsor, sponsored_value, created_at, updated_at) VALUES ${queryStringValues}`;

    await dbContext.query(query, queryValues.flat());
  }
}
