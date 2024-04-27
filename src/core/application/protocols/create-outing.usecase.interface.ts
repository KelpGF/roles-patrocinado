import { Either } from "@/domain/shared/either";
import { DomainError, InfraError } from "@/domain/shared/errors";
import { UseCase } from "./usecase.interface";

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
      guestMembers: {
        userId: string;
      }[];
      sponsorsMembers: {
        userId: string;
        sponsoredValue: number;
      }[];
    };
  };
}
