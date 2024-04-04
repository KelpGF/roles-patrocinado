import { UserEntity } from "../user/user.entity";
import { MemberEntity, Params as MemberEntityParams } from "./member.entity";

export type Params = {
  user: UserEntity;
} & MemberEntityParams;

export class GuestMemberEntity extends MemberEntity {
  constructor(params: Params) {
    super({
      id: params.id,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt,
      user: params.user,
    });
    this._sponsor = false;
    this._sponsorValue = 0;
    this._guest = true;
    this.validate();
  }
}
