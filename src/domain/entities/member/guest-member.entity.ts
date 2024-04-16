import MemberEntityAbstract, { Params } from "./member.entity.abstract";

export class GuestMemberEntity extends MemberEntityAbstract {
  constructor(params: Params) {
    super({
      id: params.id,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt,
      user: params.user,
    });
    this._guest = true;
    this._sponsor = false;
    this._sponsorValue = 0;
    this.validate();
  }
}
