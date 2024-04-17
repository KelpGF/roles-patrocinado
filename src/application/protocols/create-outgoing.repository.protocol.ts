import { OutingEntity } from "@/domain/entities";
import { Either } from "@/domain/shared/either";
import { InfraError } from "@/domain/shared/errors";

export interface CreateOutgoingRepositoryProtocol {
  create(
    data: CreateOutgoingRepositoryProtocol.Input,
  ): CreateOutgoingRepositoryProtocol.Output;
}

export namespace CreateOutgoingRepositoryProtocol {
  export type Input = { outgoing: OutingEntity };
  export type Output = Promise<Either<InfraError, { outgoingId: string }>>;
}
