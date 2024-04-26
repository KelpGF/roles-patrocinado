import { Pool, PoolClient } from "pg";

export class Database {
  private static instance: Pool;
  private static client: PoolClient;

  private constructor() {}

  static async getClient() {
    if (!Database.instance) {
      Database.instance = new Pool({
        connectionString: process.env.DATABASE_CONNECTION_STRING,
      });

      Database.instance.on("connect", () => {
        console.log("Database connected");
      });
    }

    const client = await Database.instance.connect();
    Database.client = client;
    return client;
  }

  static async end() {
    if (Database.instance) {
      Database.client.release();
      await Database.instance.end();
      console.log("Database disconnected");
    }
  }
}
