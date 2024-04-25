import { OutingDAOProtocol } from "@/infrastructure/repositories/protocols/outing.dao.protocol";
import { PoolClient } from "pg";

export class OutingDAO implements OutingDAOProtocol {
  constructor(private readonly client: PoolClient) {}

  async insertOne({
    outing,
  }: OutingDAOProtocol.Input): Promise<OutingDAOProtocol.Output> {
    const query =
      "INSERT INTO outings (id, place_name, service_fee, date, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id";

    const result = await this.client.query<{ id: string }>(query, [
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
