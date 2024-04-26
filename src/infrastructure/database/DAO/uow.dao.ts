import { PoolClient } from "pg";
import { UnityOfWorkInterface } from "../types/uow.interface";

export class UnityOfWork implements UnityOfWorkInterface<PoolClient> {
  constructor(private readonly dbContext: PoolClient) {}

  async beginTransaction() {
    await this.dbContext.query("BEGIN");
  }

  async commitTransaction() {
    await this.dbContext.query("COMMIT");
  }

  async rollbackTransaction() {
    await this.dbContext.query("ROLLBACK");
  }

  getContext(): PoolClient {
    return this.dbContext;
  }
}
