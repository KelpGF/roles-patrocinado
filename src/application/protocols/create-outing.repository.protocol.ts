import { OutingEntity } from "@/domain/entities";
import { Either } from "@/domain/shared/either";
import { InfraError } from "@/domain/shared/errors";

export interface CreateOutingRepositoryProtocol {
  create(
    input: CreateOutingRepositoryProtocol.Input,
  ): CreateOutingRepositoryProtocol.Output;
}

export namespace CreateOutingRepositoryProtocol {
  export type Input = { outing: OutingEntity };
  export type Output = Promise<Either<InfraError, { outingId: string }>>;
}
