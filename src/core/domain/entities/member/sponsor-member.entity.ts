import { CreateEntityResult } from "@/domain/shared/entities/create-entity.type";
import MemberEntityAbstract, {
  Params as MemberEntityParams,
} from "./member.entity.abstract";
import { entityErrorHandling } from "@/domain/shared/errors/entities.error.handling";
import { MembersTypeEnum } from "@/domain/shared/enum/members-type.enum";

export type Params = {
  sponsoredValue: number;
} & MemberEntityParams;

export class SponsorMemberEntity extends MemberEntityAbstract {
  private constructor(params: Params) {
    super({
      id: params.id,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt,
      user: params.user,
    });
    this._sponsoredValue = params.sponsoredValue;
    this.validate();
  }

  get type(): MembersTypeEnum {
    return MembersTypeEnum.SPONSOR;
  }

  get isGuest(): boolean {
    return false;
  }

  get isSponsor(): boolean {
    return true;
  }

  changeSponsoredValue(value: number): void {
    this._sponsoredValue = value;
    this.validate();
  }

  static create(params: Params): CreateEntityResult<SponsorMemberEntity> {
    const entity = new SponsorMemberEntity(params);

    return entityErrorHandling(entity);
  }

  static restore(params: Required<Params>): SponsorMemberEntity {
    return new SponsorMemberEntity(params);
  }
}
