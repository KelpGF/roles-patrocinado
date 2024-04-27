import { UserEntity } from "@/domain/entities";

export interface FindUserByIdsRepositoryProtocol {
  findByIds(
    input: FindUserByIdsRepositoryProtocol.Input,
  ): FindUserByIdsRepositoryProtocol.Output;
}

export namespace FindUserByIdsRepositoryProtocol {
  export type Input = { userIds: string[] };
  export type Output = Promise<UserEntity[]>;
}
