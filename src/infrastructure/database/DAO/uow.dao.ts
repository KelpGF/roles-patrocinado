import { Pool, PoolClient } from "pg";
import { UnityOfWorkInterface } from "../types/uow.interface";

export class UnityOfWork implements UnityOfWorkInterface<PoolClient> {
  private dbContext: PoolClient;
  constructor(private readonly db: Pool) {}

  async beginTransaction() {
    this.dbContext = await this.db.connect();
    await this.dbContext.query("BEGIN");
  }

  async commitTransaction() {
    await this.dbContext.query("COMMIT");
    this.dbContext.release();
  }

  async rollbackTransaction() {
    await this.dbContext.query("ROLLBACK");
    this.dbContext.release();
  }

  getContext(): PoolClient {
    return this.dbContext;
  }
}
