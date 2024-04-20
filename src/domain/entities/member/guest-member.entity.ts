import { CreateEntityResult } from "@/domain/shared/entities/create-entity.type";
import MemberEntityAbstract, { Params } from "./member.entity.abstract";
import { entityErrorHandling } from "@/domain/shared/errors/entities.error.handling";
import { MembersTypeEnum } from "@/domain/shared/enum/members-type.enum";

export class GuestMemberEntity extends MemberEntityAbstract {
  private constructor(params: Params) {
    super({
      id: params.id,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt,
      user: params.user,
    });
    this.validate();
  }

  get type(): MembersTypeEnum {
    return MembersTypeEnum.GUEST;
  }

  get isGuest(): boolean {
    return true;
  }

  get isSponsor(): boolean {
    return false;
  }

  static create(params: Params): CreateEntityResult<GuestMemberEntity> {
    const entity = new GuestMemberEntity(params);

    return entityErrorHandling(entity);
  }
}
