import { CreateOutgoingUseCaseInterface } from "@/domain/usecases";
import { CreateOutgoingUseCase } from "./create-outgoing.usecase";
import { UserEntity } from "@/domain/entities";
import EitherFactory from "@/domain/shared/either";
import { DomainError, InfraError } from "@/domain/shared/errors";

const makeInput = (): CreateOutgoingUseCaseInterface.Input => ({
  name: "Outing name",
  serviceFee: 100,
  date: new Date(),
  members: {
    commonMembers: [{ userId: "1" }, { userId: "2" }],
    sponsorsMembers: [{ userId: "3", sponsorValue: 50 }],
    guestMembers: [{ userId: "4" }],
  },
});

describe("CreateOutgoingUseCase", () => {
  let findUserByIdsRepositoryProtocol = {
    create: jest.fn(),
  };
  let createOutgoingRepository = {
    create: jest.fn().mockResolvedValue({ outingId: "1" }),
  };
  let createOutgoingUseCase: CreateOutgoingUseCase;

  beforeEach(() => {
    createOutgoingRepository = {
      create: jest
        .fn()
        .mockResolvedValue(EitherFactory.right({ outgoingId: "1" })),
    };
    findUserByIdsRepositoryProtocol = {
      create: jest.fn().mockImplementation((params: { userIds: string[] }) => {
        return Promise.resolve(
          params.userIds.map(
            (userId) =>
              UserEntity.create({ id: userId, name: `User ${userId}` })
                .value as UserEntity,
          ),
        );
      }),
    };
    createOutgoingUseCase = new CreateOutgoingUseCase(
      createOutgoingRepository,
      findUserByIdsRepositoryProtocol,
    );
  });

  test("should create an outgoing", async () => {
    const input = makeInput();

    const output = await createOutgoingUseCase.execute(input);
    const { outgoingId } = output.value as { outgoingId: string };

    expect(output.isLeft()).toBe(false);
    expect(output.isRight()).toBe(true);
    expect(outgoingId).toBe("1");
  });

  test("should return a domain error if outing entity is invalid", async () => {
    const input = makeInput();
    input.serviceFee = -1;
    input.name = "";

    const output = await createOutgoingUseCase.execute(input);
    const errors = output.value as DomainError[];

    expect(output.isLeft()).toBe(true);
    expect(output.isRight()).toBe(false);
    expect(errors).toHaveLength(2);
    expect(errors[0]).toEqual(
      new DomainError(
        'Outing: Param Place name "" must have at least 5 characters',
      ),
    );
    expect(errors[1]).toEqual(
      new DomainError("Outing: Param Service fee is invalid"),
    );
  });

  test("should return a infra error if createOutgoingRepository fails", async () => {
    const input = makeInput();
    createOutgoingRepository.create = jest
      .fn()
      .mockResolvedValue(EitherFactory.left(new InfraError("Error")));

    const output = await createOutgoingUseCase.execute(input);
    const errors = output.value as InfraError[];

    expect(output.isLeft()).toBe(true);
    expect(output.isRight()).toBe(false);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toEqual(new InfraError("Error"));
  });
});
