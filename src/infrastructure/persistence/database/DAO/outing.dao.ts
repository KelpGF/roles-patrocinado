import { InsertOutingDAOProtocol } from "@/persistence/repositories/protocols/outing-insert.dao.protocol";
import { Pool, PoolClient } from "pg";

export class OutingDAO implements InsertOutingDAOProtocol<PoolClient> {
  constructor(private readonly client: Pool) {}

  async insertOne({
    outing,
    dbContext,
  }: InsertOutingDAOProtocol.Input<PoolClient>): Promise<InsertOutingDAOProtocol.Output> {
    const queryString =
      "INSERT INTO outings (id, place_name, service_fee, date, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id";
    const queryValues = [
      outing.id,
      outing.placeName,
      outing.serviceFee,
      outing.date,
      outing.createdAt,
      outing.updatedAt,
    ];

    if (dbContext) {
      await dbContext.query(queryString, queryValues);
      return { outingId: outing.id };
    }

    await this.client.query(queryString, queryValues);
    return { outingId: outing.id };
  }
}
