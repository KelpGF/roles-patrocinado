import { CreateOutingUseCaseInterface } from "@/domain/usecases";
import { CreateOutingRepositoryProtocol } from "../protocols/create-outing.repository.protocol";
import { OutingEntity } from "@/domain/entities";
import EitherFactory from "@/domain/shared/either";
import { MembersTypeEnum } from "@/domain/shared/enum/members-type.enum";
import { Params as CreateMemberParams } from "@/domain/factory/member.factory";
import { FindUserByIdsRepositoryProtocol } from "../protocols/find-users-by-ids.repository.protocol";

export class CreateOutingUseCase implements CreateOutingUseCaseInterface {
  constructor(
    private readonly createOutingRepository: CreateOutingRepositoryProtocol,
    private readonly findUserByIdsRepositoryProtocol: FindUserByIdsRepositoryProtocol,
  ) {}

  async execute(
    input: CreateOutingUseCaseInterface.Input,
  ): Promise<CreateOutingUseCaseInterface.Output> {
    const membersList = await this.makeMembersList(input.members);
    const outingParams = {
      placeName: input.name,
      serviceFee: input.serviceFee,
      date: input.date,
      members: membersList,
    };
    const entityResult = OutingEntity.create(outingParams);
    if (entityResult.isLeft()) {
      const errors = entityResult.value.errors;
      return EitherFactory.left(errors);
    }
    const outing = entityResult.value;

    const createOutingInput = { outing: outing };
    const createOutingOutput =
      await this.createOutingRepository.create(createOutingInput);
    if (createOutingOutput.isLeft()) {
      return EitherFactory.left([createOutingOutput.value]);
    }

    const outingId = createOutingOutput.value.outingId;
    return EitherFactory.right({ outingId: outingId });
  }

  private async makeMembersList({
    commonMembers,
    guestMembers,
    sponsorsMembers,
  }: CreateOutingUseCaseInterface.Input["members"]): Promise<
    { type: MembersTypeEnum; data: CreateMemberParams }[]
  > {
    const commonIds = commonMembers.map((member) => member.userId);
    const guestIds = guestMembers.map((member) => member.userId);
    const sponsorsIds = sponsorsMembers.map((member) => member.userId);

    const [commonUsers, guestUsers, sponsorsUsers] = await Promise.all([
      this.findUserByIdsRepositoryProtocol.create({ userIds: commonIds }),
      this.findUserByIdsRepositoryProtocol.create({ userIds: guestIds }),
      this.findUserByIdsRepositoryProtocol.create({ userIds: sponsorsIds }),
    ]);

    const result: { type: MembersTypeEnum; data: CreateMemberParams }[] = []
      .concat(
        commonUsers.map((user) => ({
          type: MembersTypeEnum.COMMON,
          data: { user },
        })),
      )
      .concat(
        guestUsers.map((user) => ({
          type: MembersTypeEnum.GUEST,
          data: { user },
        })),
      )
      .concat(
        sponsorsUsers.map((user) => ({
          type: MembersTypeEnum.SPONSOR,
          data: {
            user,
            sponsoredValue: sponsorsMembers.find((m) => m.userId === user.id)
              ?.sponsoredValue,
          },
        })),
      );

    return result;
  }
}
