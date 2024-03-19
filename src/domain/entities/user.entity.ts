import { AggregateRoot } from "../shared/entities/aggregate-root.interface";
import { BaseEntityAbstract } from "../shared/entities/base-entity.abstract";

type Params = {
  id?: string;
  name: string;
};

export class UserEntity extends BaseEntityAbstract implements AggregateRoot {
  private _name: string;

  constructor(params: Params) {
    super(params.id);
    this._name = params.name;
  }

  getName() {
    return this._name;
  }

  validate() {
    if (this._name.length < 5) {
      this._notification.addNotification({
        context: "User",
        message: `Name ${this._name} has less 5 characters`,
      });
    }

    return !this._notification.hasNotification();
  }

  static create(params: Params) {
    const entity = new UserEntity(params);
    const isValid = entity.validate();

    return { user: entity, isValid };
  }
}
