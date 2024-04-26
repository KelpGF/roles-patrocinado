import { PoolClient } from "pg";

export type MemberProps = {
  id: string;
  outingId: string;
  userId: string;
  isGuest: boolean;
  isSponsor: boolean;
  sponsorValue: number;
  createdAt: Date;
  updatedAt: Date;
};

export interface InsertManyMemberDAOProtocol {
  insertMany(input: InsertManyMemberDAOProtocol.Input): Promise<void>;
}

export namespace InsertManyMemberDAOProtocol {
  export type Input = {
    members: MemberProps[];
    dbContext?: PoolClient;
  };
}
