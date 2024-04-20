import { CreateEntityResult } from "@/domain/shared/entities/create-entity.type";
import MemberEntityAbstract, { Params } from "./member.entity.abstract";
import { entityErrorHandling } from "@/domain/shared/errors/entities.error.handling";

export class GuestMemberEntity extends MemberEntityAbstract {
  private constructor(params: Params) {
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

  static create(params: Params): CreateEntityResult<GuestMemberEntity> {
    const entity = new GuestMemberEntity(params);

    return entityErrorHandling(entity);
  }
}
