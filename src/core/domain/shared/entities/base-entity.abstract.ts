import { DomainError } from "../errors";
import { Notification, NotificationInterface } from "../notification";
import IdVo from "../value-object/uuid.vo";

export type Params = {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export abstract class BaseEntityAbstract {
  protected _id: IdVo;
  protected _createdAt: Date;
  protected _updatedAt: Date;
  protected _context: string;
  private _notification: NotificationInterface;

  constructor(params: Params & { context: string }) {
    this._id = new IdVo(params.id);
    this._createdAt = params.createdAt || new Date();
    this._updatedAt = params.updatedAt || new Date();
    this._notification = new Notification();
    this._context = params.context;
  }

  get id(): string {
    return this._id.value;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get notifications() {
    return this._notification.notifications;
  }

  get notificationsMessages() {
    return this._notification.messages;
  }

  get hasNotification() {
    return this.notifications.length > 0;
  }

  addNotification(notification: DomainError) {
    this._notification.addNotification({
      context: this._context,
      notification,
    });
  }
}
