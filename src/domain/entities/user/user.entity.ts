import { AggregateRoot } from "@/domain/shared/entities/aggregate-root.interface";
import {
  BaseEntityAbstract,
  Params as BaseEntityAbstractParams,
} from "@/domain/shared/entities/base-entity.abstract";
import { InvalidParamError } from "@/domain/shared/errors/invalid-param-error";

type Params = {
  name: string;
} & BaseEntityAbstractParams;

export class UserEntity extends BaseEntityAbstract implements AggregateRoot {
  private _name: string;

  constructor(params: Params) {
    super({
      id: params.id,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt,
    });
    this._name = params.name;
    this.validate();
  }

  getName() {
    return this._name;
  }

  private validate() {
    if (this._name.length < 3) {
      this._notification.addNotification({
        context: "User",
        notification: new InvalidParamError(
          "name",
          `'${this._name}' has less 3 characters`,
        ),
      });
    }
  }

  static create(params: Params) {
    const entity = new UserEntity(params);
    const isValid = entity.hasNotification();

    return { user: entity, isValid };
  }

  static restore(params: Required<Params>) {
    return new UserEntity(params);
  }
}
