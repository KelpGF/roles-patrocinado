import { CommonMemberEntity } from "../entities/member/common-member.entity";
import { GuestMemberEntity } from "../entities/member/guest-member.entity";
import MemberEntityAbstract, {
  Params as MemberEntityParams,
} from "../entities/member/member.entity.abstract";
import {
  SponsorMemberEntity,
  Params as SponsorMemberEntityParams,
} from "../entities/member/sponsor-member.entity";
import { CreateEntityResult } from "../shared/entities/create-entity.type";
import { MembersTypeEnum } from "../shared/enum/members-type.enum";

export type Params = MemberEntityParams | SponsorMemberEntityParams;

const memberCreateStrategy = {
  common: (params: MemberEntityParams) => CommonMemberEntity.create(params),
  sponsor: (params: SponsorMemberEntityParams) =>
    SponsorMemberEntity.create(params),
  guest: (params: MemberEntityParams) => GuestMemberEntity.create(params),
};

const memberRestoreFactory = {
  common: (params: Required<MemberEntityParams>) =>
    CommonMemberEntity.restore(params),
  sponsor: (params: Required<SponsorMemberEntityParams>) =>
    SponsorMemberEntity.restore(params),
  guest: (params: Required<MemberEntityParams>) =>
    GuestMemberEntity.restore(params),
};

export default class MemberFactory {
  static create(
    type: MembersTypeEnum,
    params: Params,
  ): CreateEntityResult<MemberEntityAbstract> {
    const memberFactory =
      memberCreateStrategy[type] || memberCreateStrategy.common;

    return memberFactory(params);
  }

  static restore(
    type: MembersTypeEnum,
    params: Required<Params>,
  ): CommonMemberEntity | SponsorMemberEntity | GuestMemberEntity {
    const memberFactory =
      memberRestoreFactory[type] || memberRestoreFactory.common;

    return memberFactory(params);
  }
}
