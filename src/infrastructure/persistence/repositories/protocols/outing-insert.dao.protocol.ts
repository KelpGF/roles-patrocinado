export type OutingProps = {
  id: string;
  placeName: string;
  serviceFee: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
};

export interface InsertOutingDAOProtocol<T> {
  insertOne(
    input: InsertOutingDAOProtocol.Input<T>,
  ): Promise<InsertOutingDAOProtocol.Output>;
}

export namespace InsertOutingDAOProtocol {
  export type Input<T> = {
    outing: OutingProps;
    dbContext?: T;
  };
  export type Output = { outingId: string };
}
