export type OutingProps = {
  id: string;
  placeName: string;
  serviceFee: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
};

export interface OutingDAOProtocol {
  insertOne(input: OutingDAOProtocol.Input): Promise<OutingDAOProtocol.Output>;
}

export namespace OutingDAOProtocol {
  export type Input = {
    outing: OutingProps;
  };
  export type Output = { outingId: string };
}
