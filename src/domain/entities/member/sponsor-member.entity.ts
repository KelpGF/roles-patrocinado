import MemberEntityAbstract, {
  Params as MemberEntityParams,
} from "./member.entity.abstract";

export type Params = {
  sponsoredValue: number;
} & MemberEntityParams;

export class SponsorMemberEntity extends MemberEntityAbstract {
  constructor(params: Params) {
    super({
      id: params.id,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt,
      user: params.user,
    });
    this._guest = false;
    this._sponsor = true;
    this._sponsorValue = params.sponsoredValue;
    this.validate();
  }

  changeSponsorValue(value: number): void {
    this._sponsorValue = value;
    this.validate();
  }
}
