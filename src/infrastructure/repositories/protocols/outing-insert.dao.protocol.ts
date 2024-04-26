import { PoolClient } from "pg";

export type OutingProps = {
  id: string;
  placeName: string;
  serviceFee: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
};

export interface InsertOutingDAOProtocol {
  insertOne(
    input: InsertOutingDAOProtocol.Input,
  ): Promise<InsertOutingDAOProtocol.Output>;
}

export namespace InsertOutingDAOProtocol {
  export type Input = {
    outing: OutingProps;
    dbContext?: PoolClient;
  };
  export type Output = { outingId: string };
}
