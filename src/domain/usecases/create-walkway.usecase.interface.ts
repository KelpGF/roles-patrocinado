import { Either } from "../shared/either";
import { DomainError, InfraError } from "../shared/errors";
import { UseCase } from "./usecase.interface";

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
  };
  export type Output = Either<(InfraError | DomainError)[], string>;
}
