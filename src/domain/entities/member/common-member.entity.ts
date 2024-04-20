import { CreateEntityResult } from "@/domain/shared/entities/create-entity.type";
import MemberEntityAbstract, { Params } from "./member.entity.abstract";
import { entityErrorHandling } from "@/domain/shared/errors/entities.error.handling";
import { MembersTypeEnum } from "@/domain/shared/enum/members-type.enum";

export class CommonMemberEntity extends MemberEntityAbstract {
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
    return MembersTypeEnum.COMMON;
  }

  get isGuest(): boolean {
    return false;
  }

  get isSponsor(): boolean {
    return false;
  }

  static create(params: Params): CreateEntityResult<CommonMemberEntity> {
    const entity = new CommonMemberEntity(params);

    return entityErrorHandling(entity);
  }
}
