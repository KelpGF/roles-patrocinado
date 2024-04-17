import { Either } from "../shared/either";
import { DomainError, InfraError } from "../shared/errors";
import { UseCase } from "../shared/usecase";

export interface CreateOutgoingUseCaseInterface
  extends UseCase<
    CreateOutgoingUseCaseInterface.Input,
    CreateOutgoingUseCaseInterface.Output
  > {}

export namespace CreateOutgoingUseCaseInterface {
  export type Input = {
    name: string;
    date: Date;
    serviceFee: number;
  } & Members;
  export type Output = Either<
    (InfraError | DomainError)[],
    { outgoingId: string }
  >;

  type Members = {
    members: {
      commonMembers: {
        userId: string;
      }[];
      sponsorsMembers: {
        userId: string;
        sponsorValue: number;
      }[];
      guestMembers: {
        userId: string;
      }[];
    };
  };
}
