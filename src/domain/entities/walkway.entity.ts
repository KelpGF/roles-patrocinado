import { AggregateRoot } from "../shared/entities/aggregate-root.interface";
import { BaseEntityAbstract } from "../shared/entities/base-entity.abstract";
import { MemberEntity } from "./member.entity";

type Params = {
  id?: string;
  members: MemberEntity[];
  placeName: string;
  date: Date;
  serviceCharge: number;
};

export class WalkwayEntity extends BaseEntityAbstract implements AggregateRoot {
  private _placeName: string;
  private _date: Date;
  private _serviceCharge: number;
  private _members: MemberEntity[];

  constructor(params: Params) {
    super(params.id);
    this._placeName = params.placeName;
    this._date = params.date;
    this._serviceCharge = params.serviceCharge;
    this._members = params.members;
  }

  getPlaceName(): string {
    return this._placeName;
  }

  getDate(): Date {
    return this._date;
  }

  getServiceCharge(): number {
    return this._serviceCharge;
  }

  getMembers(): MemberEntity[] {
    return this._members;
  }

  addMember(member: MemberEntity): void {
    this._members.push(member);
  }

  removeMember(member: MemberEntity): void {
    this._members = this._members.filter((m) => m.id() !== member.id());
  }

  validate(): boolean {
    if (this._placeName.length < 5) {
      this._notification.addNotification({
        context: "Walkway",
        message: `Place name "${this._placeName}" must have at least 5 characters`,
      });
    }

    return !this._notification.hasNotification();
  }

  static create(params: Params): { walkway: WalkwayEntity; isValid: boolean } {
    const entity = new WalkwayEntity(params);
    const isValid = entity.validate();

    return { walkway: entity, isValid };
  }
}
