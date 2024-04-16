import EitherFactory from "@/domain/shared/either";
import { AggregateRoot } from "@/domain/shared/entities/aggregate-root.interface";
import { BaseEntityAbstract } from "@/domain/shared/entities/base-entity.abstract";
import {
  CreateEntityParams,
  CreateEntityResult,
} from "@/domain/shared/entities/create-entity.type";
import { InvalidParamError } from "@/domain/shared/errors/invalid-param-error";

type Params = CreateEntityParams<{
  name: string;
}>;

export class UserEntity extends BaseEntityAbstract implements AggregateRoot {
  private _name: string;

  private constructor(params: Params) {
    super({
      id: params.id,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt,
      context: "User",
    });
    this._name = params.name;
    this.validate();
  }

  get name() {
    return this._name;
  }

  private validate() {
    if (this._name.length < 3) {
      this.addNotification(
        new InvalidParamError("name", `'${this._name}' has less 3 characters`),
      );
    }
  }

  static create(params: Params): CreateEntityResult<UserEntity> {
    const entity = new UserEntity(params);

    if (entity.hasNotification) {
      return EitherFactory.left({ errors: entity.notificationsMessages });
    }

    return EitherFactory.right(entity);
  }

  static restore(params: Required<Params>) {
    return new UserEntity(params);
  }
}
