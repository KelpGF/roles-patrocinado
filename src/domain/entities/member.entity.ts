import { BaseEntityAbstract } from "../shared/entities/base-entity.abstract";
import { UserEntity } from "./user.entity";

type Params = {
  id?: string;
  user: UserEntity;
  guest?: boolean;
  sponsor?: boolean;
  sponsoredValue?: number;
};

export class MemberEntity extends BaseEntityAbstract {
  private _user: UserEntity;
  private _guest: boolean;
  private _sponsor: boolean;
  private _sponsoredValue: number;

  constructor(params: Params) {
    super(params.id);
    this._user = params.user;
    this._guest = params.guest;
    this._sponsor = params.sponsor;
    this._sponsoredValue = params.sponsoredValue || 0;
  }

  getUser(): UserEntity {
    return this._user;
  }

  isGuest(): boolean {
    return this._guest;
  }

  isSponsor(): boolean {
    return this._sponsor;
  }

  getSponsoredValue(): number {
    return this._sponsoredValue;
  }

  validate(): boolean {
    if (this._guest && this._sponsor) {
      this._notification.addNotification({
        context: "Member",
        message: `Member ${this._user.getName()} cannot be a guest and a sponsor at the same time`,
      });
    }

    if (
      this._sponsor &&
      (this._sponsoredValue < 50 || Number.isNaN(Number(this._sponsoredValue)))
    ) {
      this._notification.addNotification({
        context: "Member",
        message: `Member ${this._user.getName()} has a invalid sponsored value: "${this._sponsoredValue}"`,
      });
    }

    return !this._notification.hasNotification();
  }

  static create(params: Params): { member: MemberEntity; isValid: boolean } {
    const entity = new MemberEntity(params);
    const isValid = entity.validate();

    return { member: entity, isValid };
  }
}
