import { CreateOutgoingUseCaseInterface } from "@/domain/usecases";
import { CreateOutgoingRepositoryProtocol } from "../protocols/create-outgoing.repository.protocol";
import { OutingEntity } from "@/domain/entities";
import EitherFactory from "@/domain/shared/either";
import { MembersTypeEnum } from "@/domain/shared/enum/members-type.enum";
import { Params as CreateMemberParams } from "@/domain/factory/member.factory";
import { FindUserByIdsRepositoryProtocol } from "../protocols/find-users-by-ids.repository.protocol";

export class CreateOutgoingUseCase implements CreateOutgoingUseCaseInterface {
  constructor(
    private readonly createOutgoingRepository: CreateOutgoingRepositoryProtocol,
    private readonly findUserByIdsRepositoryProtocol: FindUserByIdsRepositoryProtocol,
  ) {}

  async execute(
    input: CreateOutgoingUseCaseInterface.Input,
  ): Promise<CreateOutgoingUseCaseInterface.Output> {
    const membersList = await this.makeMembersList(input.members);
    const outgoingParams = {
      placeName: input.name,
      serviceFee: input.serviceFee,
      date: input.date,
      members: membersList,
    };
    const entityResult = OutingEntity.create(outgoingParams);
    if (entityResult.isLeft()) {
      const errors = entityResult.value.errors;
      return EitherFactory.left(errors);
    }
    const outgoing = entityResult.value;

    const createOutgoingInput = { outgoing: outgoing };
    const createOutgoingOutput =
      await this.createOutgoingRepository.create(createOutgoingInput);
    if (createOutgoingOutput.isLeft()) {
      return EitherFactory.left([createOutgoingOutput.value]);
    }

    const outgoingId = createOutgoingOutput.value.outgoingId;
    return EitherFactory.right({ outgoingId: outgoingId });
  }

  private async makeMembersList({
    commonMembers,
    guestMembers,
    sponsorsMembers,
  }: CreateOutgoingUseCaseInterface.Input["members"]): Promise<
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
              ?.sponsorValue,
          },
        })),
      );

    return result;
  }
}
