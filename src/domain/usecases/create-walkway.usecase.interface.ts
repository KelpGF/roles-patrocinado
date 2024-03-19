import { Either } from "../shared/either";
import { DomainError, InfraError } from "../shared/errors";
import { UseCase } from "../shared/usecase";

export interface CreateWalkwayUseCaseInterface
  extends UseCase<
    CreateWalkwayUseCaseInterface.Input,
    CreateWalkwayUseCaseInterface.Output
  > {}

export namespace CreateWalkwayUseCaseInterface {
  export type Input = {
    name: string;
    date: Date;
    serviceCharge: number;
    membersId: string[];
    sponsorsId: string[];
  };
  export type Output = Either<(InfraError | DomainError)[], string>;
}
