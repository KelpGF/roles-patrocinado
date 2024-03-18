import { Notification, NotificationInterface } from "../notification";

export abstract class EntityAbstract {
  protected _id: string;
  protected _notification: NotificationInterface;

  constructor(id: string) {
    this._id = id;
    this._notification = new Notification();
  }

  id(): string {
    return this._id;
  }
}
