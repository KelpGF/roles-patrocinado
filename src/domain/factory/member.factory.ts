import { CommonMemberEntity } from "../entities/member/common-member.entity";
import { GuestMemberEntity } from "../entities/member/guest-member.entity";
import { Params as MemberEntityParams } from "../entities/member/member.entity.abstract";
import {
  SponsorMemberEntity,
  Params as SponsorMemberEntityParams,
} from "../entities/member/sponsor-member.entity";
import { CreateEntityResult } from "../shared/entities/create-entity.type";
import { MembersTypeEnum } from "../shared/enum/members-type.enum";

export type Params = MemberEntityParams | SponsorMemberEntityParams;

const memberStrategy = {
  common: (params: MemberEntityParams) => CommonMemberEntity.create(params),
  sponsor: (params: SponsorMemberEntityParams) =>
    SponsorMemberEntity.create(params),
  guest: (params: MemberEntityParams) => GuestMemberEntity.create(params),
};

export default class MemberFactory {
  static create(
    type: MembersTypeEnum,
    params: Params,
  ): CreateEntityResult<
    CommonMemberEntity | SponsorMemberEntity | GuestMemberEntity
  > {
    const memberFactory = memberStrategy[type] || memberStrategy.common;

    return memberFactory(params);
  }
}
