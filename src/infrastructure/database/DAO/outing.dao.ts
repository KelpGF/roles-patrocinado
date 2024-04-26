import { InsertOutingDAOProtocol } from "@/infrastructure/repositories/protocols/outing-insert.dao.protocol";
import { PoolClient } from "pg";

export class OutingDAO implements InsertOutingDAOProtocol<PoolClient> {
  constructor(private readonly client: PoolClient) {}

  async insertOne({
    outing,
    dbContext = this.client,
  }: InsertOutingDAOProtocol.Input<PoolClient>): Promise<InsertOutingDAOProtocol.Output> {
    const query =
      "INSERT INTO outings (id, place_name, service_fee, date, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id";

    const result = await dbContext.query<{ id: string }>(query, [
      outing.id,
      outing.placeName,
      outing.serviceFee,
      outing.date,
      outing.createdAt,
      outing.updatedAt,
    ]);

    return { outingId: result.rows[0].id };
  }
}
