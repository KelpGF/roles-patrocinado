import { InsertManyMemberDAOProtocol } from "@/persistence/repositories/protocols/member-insert.dao.protocol";
import { Pool, PoolClient } from "pg";

export class MemberDAO implements InsertManyMemberDAOProtocol<PoolClient> {
  constructor(private readonly client: Pool) {}

  async insertMany({
    members,
    dbContext,
  }: InsertManyMemberDAOProtocol.Input<PoolClient>): Promise<void> {
    const queryStringValues = [];
    const queryValues = [];

    for (const member of members) {
      const values = [
        member.id,
        member.outingId,
        member.userId,
        member.isGuest,
        member.isSponsor,
        member.sponsoredValue,
        member.createdAt,
        member.updatedAt,
      ];
      const offset = queryValues.length;

      queryStringValues.push(
        `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6}, $${offset + 7}, $${offset + 8})`,
      );
      queryValues.push(...values);
    }

    const queryString = `INSERT INTO members (id, outing_id, user_id, is_guest, is_sponsor, sponsored_value, created_at, updated_at) VALUES ${queryStringValues}`;

    if (dbContext) {
      await dbContext.query(queryString, queryValues.flat());
      return;
    }

    await this.client.query(queryString, queryValues.flat());
  }
}
