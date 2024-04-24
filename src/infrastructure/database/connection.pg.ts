import { Pool } from "pg";

export class Database {
  private static instance: Pool;

  private constructor() {}

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Pool({
        connectionString: process.env.DATABASE_CONNECTION_STRING,
      });
    }

    return Database.instance;
  }
}
