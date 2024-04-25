import { PoolClient } from "pg";
import {
  UserDAOProtocol,
  UserProps,
} from "../../repositories/protocols/user.dao.protocol";

export class UserDAO implements UserDAOProtocol {
  constructor(private readonly client: PoolClient) {}

  async inList<T>(
    field: keyof UserProps,
    list: Array<T>,
  ): Promise<UserProps[]> {
    const { rows } = await this.client.query<UserProps>(
      `SELECT id, name, created_at, updated_at FROM users WHERE ${field} = ANY($1)`,
      [list],
    );

    return rows;
  }
}
