import { Notification, NotificationInterface } from "../notification";
import IdVo from "../value-object/uuid.vo";

export abstract class BaseEntityAbstract {
  protected _id: IdVo;
  protected _createdAt: Date;
  protected _updatedAt: Date;
  protected _notification: NotificationInterface;

  constructor(id: string) {
    this._id = new IdVo(id);
    this._createdAt = new Date();
    this._updatedAt = new Date();
    this._notification = new Notification();
  }

  id(): string {
    return this._id.value;
  }

  createdAt(): Date {
    return this._createdAt;
  }

  updatedAt(): Date {
    return this._updatedAt;
  }
}
