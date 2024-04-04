import { DomainError } from "@/domain/shared/errors";
import {
  BaseEntityAbstract,
  Params as BaseEntityAbstractParams,
} from "../../shared/entities/base-entity.abstract";
import { UserEntity } from "../user/user.entity";

export type Params = {
  user: UserEntity;
} & BaseEntityAbstractParams;

export class MemberEntity extends BaseEntityAbstract {
  protected _user: UserEntity;
  protected _guest: boolean;
  protected _sponsor: boolean;
  protected _sponsorValue: number;

  constructor(params: Params) {
    super({
      id: params.id,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt,
      context: "Member",
    });
    this._user = params.user;
    this._guest = false;
    this._sponsor = false;
    this._sponsorValue = 0;
    this.validate();
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

  getSponsorValue(): number {
    return this._sponsorValue;
  }

  validate() {
    if (this.isGuest() && this.isSponsor()) {
      this.addNotification(
        new DomainError(
          `Member ${this._user.getName()} cannot be a guest and a sponsor at the same time`,
        ),
      );
    }

    if (
      this.isSponsor() &&
      (this.getSponsorValue() < 50 ||
        Number.isNaN(Number(this.getSponsorValue())))
    ) {
      this.addNotification(
        new DomainError(
          `Member ${this._user.getName()} has a invalid sponsored value: "${this.getSponsorValue()}"`,
        ),
      );
    }

    if (this.isGuest() && this.getSponsorValue() > 0) {
      this.addNotification(
        new DomainError(
          `Member ${this._user.getName()} cannot be a guest and have a sponsored value at the same time`,
        ),
      );
    }
  }
}
