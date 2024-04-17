import MemberFactory, {
  Params as CreateMemberParams,
} from "@/domain/factory/member.factory";
import { AggregateRoot } from "../../shared/entities/aggregate-root.interface";
import {
  BaseEntityAbstract,
  Params as BaseEntityAbstractParams,
} from "../../shared/entities/base-entity.abstract";
import { InvalidParamError } from "../../shared/errors/invalid-param-error";
import MemberEntityAbstract, {
  Params as MemberEntityParams,
} from "../member/member.entity.abstract";
import { MembersTypeEnum } from "@/domain/shared/enum/members-type.enum";
import IdVo from "@/domain/shared/value-object/uuid.vo";
import { DomainError } from "@/domain/shared/errors";
import { CreateEntityResult } from "@/domain/shared/entities/create-entity.type";
import EitherFactory from "@/domain/shared/either";

type Params = {
  placeName: string;
  serviceFee: number;
  date: Date;
  members?: { type: MembersTypeEnum; data: MemberEntityParams }[];
} & BaseEntityAbstractParams;

export class OutingEntity extends BaseEntityAbstract implements AggregateRoot {
  private _placeName: string;
  private _date: Date;
  private _serviceFee: number;
  private _members: MemberEntityAbstract[] = [];

  private constructor(params: Params) {
    super({
      id: params.id,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt,
      context: "Outing",
    });
    this._placeName = params.placeName;
    this._date = params.date;
    this._serviceFee = params.serviceFee;

    if (params.members) {
      params.members.forEach((member) => {
        this.addMember(member.type, member.data);
      });
    }

    this.validate();
  }

  get placeName(): string {
    return this._placeName;
  }

  get date(): Date {
    return this._date;
  }

  get serviceFee(): number {
    return this._serviceFee;
  }

  get members(): MemberEntityAbstract[] {
    return this._members;
  }

  addMember(type: MembersTypeEnum, params: CreateMemberParams) {
    let memberAlreadyExists = false;

    for (const member of this._members) {
      if (params.id === member.id || params.user.id === member.user.id) {
        memberAlreadyExists = true;
        break;
      }
    }
    if (memberAlreadyExists) return;

    const result = MemberFactory.create(type, params);
    if (result.isLeft()) {
      result.value.errors.forEach((error) => {
        this.addNotification(new DomainError(error));
      });
      return;
    }

    this._members.push(result.value);
  }

  removeMember(id: IdVo): void {
    this._members = this._members.filter((member) => id.value !== member.id);
  }

  validate() {
    if (this._placeName.length < 5) {
      this.addNotification(
        new InvalidParamError(
          "Place name",
          `"${this._placeName}" must have at least 5 characters`,
        ),
      );
    }

    if (this._serviceFee < 0 || Number.isNaN(Number(this._serviceFee))) {
      this.addNotification(new InvalidParamError("Service fee"));
    }
  }

  private restoreMembers(members: MemberEntityAbstract[]): void {
    members.forEach((member) => {
      this._members.push(member);
    });
  }

  static create(params: Params): CreateEntityResult<OutingEntity> {
    const entity = new OutingEntity(params);

    if (entity.hasNotification) {
      return EitherFactory.left({ errors: entity.notificationsMessages });
    }

    return EitherFactory.right(entity);
  }

  static restore(
    params: Omit<Required<Params>, "members"> & {
      members: MemberEntityAbstract[];
    },
  ): OutingEntity {
    const entity = new OutingEntity({
      id: params.id,
      placeName: params.placeName,
      serviceFee: params.serviceFee,
      date: params.date,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt,
    });
    entity.restoreMembers(params.members);

    return entity;
  }
}
