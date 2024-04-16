import { CommonMemberEntity } from "../entities/member/common-member.entity";
import { GuestMemberEntity } from "../entities/member/guest-member.entity";
import { Params as MemberEntityParams } from "../entities/member/member.entity.abstract";
import {
  SponsorMemberEntity,
  Params as SponsorMemberEntityParams,
} from "../entities/member/sponsor-member.entity";
import { MembersTypeEnum } from "../shared/enum/members-type.enum";

export type Params = MemberEntityParams | SponsorMemberEntityParams;

const memberStrategy = {
  member: (params: MemberEntityParams) => new CommonMemberEntity(params),
  sponsor: (params: SponsorMemberEntityParams) =>
    new SponsorMemberEntity(params),
  guest: (params: MemberEntityParams) => new GuestMemberEntity(params),
};

export default class MemberFactory {
  // TODO: constructor privado nas classes de entidade
  static create(type: MembersTypeEnum, params: Params) {
    const memberFactory = memberStrategy[type] || memberStrategy.member;

    const member = memberFactory(params);
    const isValid = !member.hasNotification;

    return { member, isValid };
  }
}
