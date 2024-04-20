import { CreateEntityResult } from "@/domain/shared/entities/create-entity.type";
import MemberEntityAbstract, {
  Params as MemberEntityParams,
} from "./member.entity.abstract";
import { entityErrorHandling } from "@/domain/shared/errors/entities.error.handling";

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
    this._guest = false;
    this._sponsor = true;
    this._sponsorValue = params.sponsoredValue;
    this.validate();
  }

  changeSponsorValue(value: number): void {
    this._sponsorValue = value;
    this.validate();
  }

  static create(params: Params): CreateEntityResult<SponsorMemberEntity> {
    const entity = new SponsorMemberEntity(params);

    return entityErrorHandling(entity);
  }
}
