import { Either } from "../shared/either";
import { DomainError, InfraError } from "../shared/errors";
import { UseCase } from "../shared/usecase";

export interface CreateOutingUseCaseInterface
  extends UseCase<
    CreateOutingUseCaseInterface.Input,
    CreateOutingUseCaseInterface.Output
  > {}

export namespace CreateOutingUseCaseInterface {
  export type Input = {
    name: string;
    date: Date;
    serviceFee: number;
  } & Members;
  export type Output = Either<
    (InfraError | DomainError)[],
    { outingId: string }
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
