import { CreateEntityResult } from "@/domain/shared/entities/create-entity.type";
import MemberEntityAbstract, { Params } from "./member.entity.abstract";
import EitherFactory from "@/domain/shared/either";

export class CommonMemberEntity extends MemberEntityAbstract {
  private constructor(params: Params) {
    super({
      id: params.id,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt,
      user: params.user,
    });
    this._guest = false;
    this._sponsor = false;
    this._sponsorValue = 0;
    this.validate();
  }

  static create(params: Params): CreateEntityResult<CommonMemberEntity> {
    const entity = new CommonMemberEntity(params);

    if (entity.hasNotification) {
      return EitherFactory.left({ errors: entity.notificationsMessages });
    }

    return EitherFactory.right(entity);
  }
}
