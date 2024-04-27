export type MemberProps = {
  id: string;
  outingId: string;
  userId: string;
  isGuest: boolean;
  isSponsor: boolean;
  sponsoredValue: number;
  createdAt: Date;
  updatedAt: Date;
};

export interface InsertManyMemberDAOProtocol<T> {
  insertMany(input: InsertManyMemberDAOProtocol.Input<T>): Promise<void>;
}

export namespace InsertManyMemberDAOProtocol {
  export type Input<T> = {
    members: MemberProps[];
    dbContext?: T;
  };
}
