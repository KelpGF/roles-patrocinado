import { DomainError } from "@/domain/shared/errors";
import { BaseEntityAbstract } from "../../shared/entities/base-entity.abstract";
import { UserEntity } from "../user/user.entity";
import { CreateEntityParams } from "@/domain/shared/entities/create-entity.type";

export type Params = CreateEntityParams<{
  user: UserEntity;
}>;
export default abstract class MemberEntityAbstract extends BaseEntityAbstract {
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
  }

  get user(): UserEntity {
    return this._user;
  }

  get isGuest(): boolean {
    return this._guest;
  }

  get isSponsor(): boolean {
    return this._sponsor;
  }

  get sponsorValue(): number {
    return this._sponsorValue;
  }

  validate() {
    if (this.isGuest && this.isSponsor) {
      this.addNotification(
        new DomainError(
          `Member ${this._user.name} cannot be a guest and a sponsor at the same time`,
        ),
      );
    }

    if (
      this.isSponsor &&
      (this.sponsorValue < 50 || Number.isNaN(Number(this.sponsorValue)))
    ) {
      this.addNotification(
        new DomainError(
          `Sponsor ${this._user.name} has a invalid sponsored value "${this.sponsorValue}"`,
        ),
      );
    }

    if (this.isGuest && this.sponsorValue > 0) {
      this.addNotification(
        new DomainError(
          `Member ${this._user.name} cannot be a guest and have a sponsored value at the same time`,
        ),
      );
    }
  }
}
