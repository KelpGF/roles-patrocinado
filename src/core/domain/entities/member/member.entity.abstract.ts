import { DomainError } from "@/domain/shared/errors";
import { BaseEntityAbstract } from "../../shared/entities/base-entity.abstract";
import { UserEntity } from "../user/user.entity";
import { CreateEntityParams } from "@/domain/shared/entities/create-entity.type";
import { MembersTypeEnum } from "@/domain/shared/enum/members-type.enum";

export type Params = CreateEntityParams<{
  user: UserEntity;
}>;
export default abstract class MemberEntityAbstract extends BaseEntityAbstract {
  protected _user: UserEntity;
  protected _sponsoredValue: number;

  protected constructor(params: Params) {
    super({
      id: params.id,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt,
      context: "Member",
    });
    this._user = params.user;
    this._sponsoredValue = 0;
  }

  abstract get type(): MembersTypeEnum;
  abstract get isGuest(): boolean;
  abstract get isSponsor(): boolean;

  get sponsoredValue(): number {
    return this._sponsoredValue || 0;
  }

  get user(): UserEntity {
    return this._user;
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
      (this.sponsoredValue < 50 || Number.isNaN(Number(this.sponsoredValue)))
    ) {
      this.addNotification(
        new DomainError(
          `Sponsor ${this._user.name} has a invalid sponsored value "${this.sponsoredValue}"`,
        ),
      );
    }

    if (this.isGuest && this.sponsoredValue > 0) {
      this.addNotification(
        new DomainError(
          `Member ${this._user.name} cannot be a guest and have a sponsored value at the same time`,
        ),
      );
    }
  }
}
