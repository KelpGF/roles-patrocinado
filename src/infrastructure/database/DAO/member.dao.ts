import { MemberDAOProtocol } from "@/infrastructure/repositories/protocols/member.dao.protocol";
import { PoolClient } from "pg";

export class MemberDAO implements MemberDAOProtocol {
  constructor(private readonly client: PoolClient) {}

  // TODO: refactor
  async insertMany(input: MemberDAOProtocol.Input): Promise<void> {
    const queryStringValues = Array.from(
      { length: input.members.length },
      (_, i) =>
        `($${i * 8 + 1}, $${i * 8 + 2}, $${i * 8 + 3}, $${i * 8 + 4}, $${i * 8 + 5}, $${i * 8 + 6}, $${i * 8 + 7}, $${i * 8 + 8})`,
    ).join(", ");
    const queryValues = input.members.map((member) => [
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

    await this.client.query(query, queryValues.flat());
  }
}
