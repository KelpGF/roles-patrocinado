import { FindUserByIdsRepositoryProtocol } from "@/domain/repositories/find-users-by-ids.repository.protocol";
import { UserDAOProtocol } from "../protocols/user.dao.protocol";
import { UserEntity } from "@/domain/entities";

export class FindUserByIdsRepository
  implements FindUserByIdsRepositoryProtocol
{
  constructor(private readonly userDAO: UserDAOProtocol) {}

  async findByIds(
    input: FindUserByIdsRepositoryProtocol.Input,
  ): FindUserByIdsRepositoryProtocol.Output {
    try {
      const users = await this.userDAO.inList<"id">("id", input.userIds);
      return users.map((user) =>
        UserEntity.restore({
          id: user.id,
          name: user.name,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
        }),
      );
    } catch (error) {
      // TODO: Implement logger
      console.error(error);
      return [];
    }
  }
}
