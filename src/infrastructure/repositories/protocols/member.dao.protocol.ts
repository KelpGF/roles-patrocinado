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

export interface MemberDAOProtocol {
  insertMany(input: MemberDAOProtocol.Input): Promise<void>;
}

export namespace MemberDAOProtocol {
  export type Input = {
    members: MemberProps[];
  };
}
