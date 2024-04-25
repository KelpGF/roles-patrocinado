import { Pool } from "pg";

export class Database {
  private static instance: Pool;

  private constructor() {}

  static async getInstance() {
    if (!Database.instance) {
      Database.instance = new Pool({
        connectionString: process.env.DATABASE_CONNECTION_STRING,
      });

      Database.instance.on("connect", () => {
        console.log("Database connected");
      });
    }

    return Database.instance.connect();
  }

  static async end() {
    if (Database.instance) {
      await Database.instance.end();
      console.log("Database disconnected");
    }
  }
}
