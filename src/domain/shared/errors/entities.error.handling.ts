import EitherFactory from "../either";
import { BaseEntityAbstract } from "../entities/base-entity.abstract";
import { CreateEntityResult } from "../entities/create-entity.type";
import { DomainError } from ".";

export const entityErrorHandling = <T extends BaseEntityAbstract>(
  entity: T,
): CreateEntityResult<T> => {
  if (entity.hasNotification) {
    return EitherFactory.left({
      errors: entity.notificationsMessages.map((message) => {
        return new DomainError(message);
      }),
    });
  }

  return EitherFactory.right(entity);
};
