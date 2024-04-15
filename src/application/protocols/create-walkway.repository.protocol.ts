import { Either } from "@/domain/shared/either";
import { InfraError } from "@/domain/shared/errors";

export interface CreateWalkwayRepositoryProtocol {
  create(
    data: CreateWalkwayRepositoryProtocol.Input,
  ): CreateWalkwayRepositoryProtocol.Output;
}

export namespace CreateWalkwayRepositoryProtocol {
  export type Input = any;
  export type Output = Promise<Either<InfraError, string>>;
}
