import MemberFactory, {
  Params as CreateMemberParams,
} from "@/domain/factory/member.factory";
import { AggregateRoot } from "../../shared/entities/aggregate-root.interface";
import {
  BaseEntityAbstract,
  Params as BaseEntityAbstractParams,
} from "../../shared/entities/base-entity.abstract";
import { InvalidParamError } from "../../shared/errors/invalid-param-error";
import {
  MemberEntity,
  Params as MemberEntityParams,
} from "../member/member.entity";
import { MembersTypeEnum } from "@/domain/shared/enum/members-type.enum";
import IdVo from "@/domain/shared/value-object/uuid.vo";

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
  private _members: MemberEntity[] = [];

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

  getPlaceName(): string {
    return this._placeName;
  }

  getDate(): Date {
    return this._date;
  }

  getServiceFee(): number {
    return this._serviceFee;
  }

  getMembers(): MemberEntity[] {
    return this._members;
  }

  addMember(type: MembersTypeEnum, params: CreateMemberParams): boolean {
    const result = MemberFactory.create(type, params);
    const member = result.member;

    if (!result.isValid) {
      this.addMemberNotification(member);
      return false;
    }

    this._members.push(member);
    return true;
  }

  removeMember(id: IdVo): void {
    this._members = this._members.filter((member) => id.value !== member.id());
  }

  private restoreMembers(member: MemberEntity[]): void {
    member.forEach((member) => {
      this._members.push(member);
    });
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
      this.addNotification(new InvalidParamError("Service charge"));
    }

    this._members.forEach((member) => {
      member.validate();
      if (!member.hasNotification()) this.addMemberNotification(member);
    });
  }

  private addMemberNotification(member: MemberEntity): void {
    const notifications = member.getNotifications();

    notifications.forEach((notification) => {
      this.addNotification(notification.notification);
    });
  }

  static create(params: Params): {
    outgoing: OutingEntity;
    isValid: boolean;
  } {
    const entity = new OutingEntity(params);

    const isValid = !entity.hasNotification();

    return { outgoing: entity, isValid };
  }

  static restore(
    params: Omit<Required<Params>, "members"> & { members: MemberEntity[] },
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
