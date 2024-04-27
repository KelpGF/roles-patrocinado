import { CreateOutingUseCaseInterface } from "@/application/protocols";
import { CreateOutingRepositoryProtocol } from "@/domain/repositories/create-outing.repository.protocol";
import { OutingEntity } from "@/domain/entities";
import EitherFactory from "@/domain/shared/either";
import { MembersTypeEnum } from "@/domain/shared/enum/members-type.enum";
import { Params as CreateMemberParams } from "@/domain/factory/member.factory";
import { FindUserByIdsRepositoryProtocol } from "@/domain/repositories/find-users-by-ids.repository.protocol";

type InputMembers = CreateOutingUseCaseInterface.Input["members"];
type MembersList = { type: MembersTypeEnum; data: CreateMemberParams }[];
export class CreateOutingUseCase implements CreateOutingUseCaseInterface {
  constructor(
    private readonly outingRepository: CreateOutingRepositoryProtocol,
    private readonly userRepository: FindUserByIdsRepositoryProtocol,
  ) {}

  async execute(
    input: CreateOutingUseCaseInterface.Input,
  ): Promise<CreateOutingUseCaseInterface.Output> {
    const membersList = await this.generateMembersList(input.members);

    const entityParams = {
      placeName: input.name,
      serviceFee: input.serviceFee,
      date: input.date,
      members: membersList,
    };
    const entityResult = OutingEntity.create(entityParams);
    if (entityResult.isLeft()) {
      const errors = entityResult.value.errors;
      return EitherFactory.left(errors);
    }

    const outing = entityResult.value;
    const outingRepositoryInput = { outing: outing };
    const outingRepositoryOutput = await this.outingRepository.create(
      outingRepositoryInput,
    );
    if (outingRepositoryOutput.isLeft()) {
      return EitherFactory.left([outingRepositoryOutput.value]);
    }

    const outingId = outingRepositoryOutput.value.outingId;
    return EitherFactory.right({ outingId: outingId });
  }

  private async generateMembersList({
    commonMembers,
    guestMembers,
    sponsorsMembers,
  }: InputMembers): Promise<MembersList> {
    const memberMap: Map<
      string,
      { type: MembersTypeEnum; sponsoredValue?: number }
    > = new Map();
    const ids: string[] = [];

    commonMembers.forEach((member) => {
      memberMap.set(member.userId, { type: MembersTypeEnum.COMMON });
      ids.push(member.userId);
    });
    guestMembers.forEach((member) => {
      memberMap.set(member.userId, { type: MembersTypeEnum.GUEST });
      ids.push(member.userId);
    });
    sponsorsMembers.forEach((member) => {
      memberMap.set(member.userId, {
        type: MembersTypeEnum.SPONSOR,
        sponsoredValue: member.sponsoredValue,
      });
      ids.push(member.userId);
    });

    const users = await this.userRepository.findByIds({
      userIds: ids,
    });

    const result: MembersList = [];

    for (const user of users) {
      const member = memberMap.get(user.id);
      if (!member) continue;

      result.push({
        type: member.type,
        data: {
          user: user,
          sponsoredValue: member.sponsoredValue,
        },
      });
    }

    memberMap.clear();

    return result;
  }
}
