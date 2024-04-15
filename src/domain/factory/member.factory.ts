import {
  MemberEntity,
  Params as MemberEntityParams,
} from "../entities/member/member.entity";
import {
  GuestMemberEntity,
  Params as GuestMemberEntityParams,
} from "../entities/member/guest-member.entity";
import {
  SponsorMemberEntity,
  Params as SponsorMemberEntityParams,
} from "../entities/member/sponsor-member.entity";

type MembersType = "member" | "sponsor" | "guest";

type Params =
  | MemberEntityParams
  | SponsorMemberEntityParams
  | GuestMemberEntityParams;

const memberStrategy = {
  member: (params: MemberEntityParams) => new MemberEntity(params),
  sponsor: (params: SponsorMemberEntityParams) =>
    new SponsorMemberEntity(params),
  guest: (params: GuestMemberEntityParams) => new GuestMemberEntity(params),
};

export default class MemberFactory {
  static create(type: MembersType, params: Params) {
    const memberFactory = memberStrategy[type] || memberStrategy.member;

    const member = memberFactory(params);
    const isValid = !member.hasNotification();

    return { member, isValid };
  }
}
