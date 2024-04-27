import { CreateOutingUseCaseInterface } from "@/application/protocols";
import { CreateOutingUseCase } from "./create-outing.usecase";
import { UserEntity } from "@/domain/entities";
import EitherFactory from "@/domain/shared/either";
import { DomainError, InfraError } from "@/domain/shared/errors";

const makeInput = (): CreateOutingUseCaseInterface.Input => ({
  name: "Outing name",
  serviceFee: 100,
  date: new Date(),
  members: {
    commonMembers: [{ userId: "1" }, { userId: "2" }],
    sponsorsMembers: [{ userId: "3", sponsoredValue: 50 }],
    guestMembers: [{ userId: "4" }],
  },
});

describe("CreateOutingUseCase", () => {
  let findUserByIdsRepositoryProtocol = {
    findByIds: jest.fn(),
  };
  let createOutingRepository = {
    create: jest.fn().mockResolvedValue({ outingId: "1" }),
  };
  let createOutingUseCase: CreateOutingUseCase;

  beforeEach(() => {
    createOutingRepository = {
      create: jest
        .fn()
        .mockResolvedValue(EitherFactory.right({ outingId: "1" })),
    };
    findUserByIdsRepositoryProtocol = {
      findByIds: jest
        .fn()
        .mockImplementation((params: { userIds: string[] }) => {
          return Promise.resolve(
            params.userIds.map(
              (userId) =>
                UserEntity.create({ id: userId, name: `User ${userId}` })
                  .value as UserEntity,
            ),
          );
        }),
    };
    createOutingUseCase = new CreateOutingUseCase(
      createOutingRepository,
      findUserByIdsRepositoryProtocol,
    );
  });

  test("should create an outing", async () => {
    const input = makeInput();

    const output = await createOutingUseCase.execute(input);
    const { outingId } = output.value as { outingId: string };

    expect(output.isLeft()).toBe(false);
    expect(output.isRight()).toBe(true);
    expect(outingId).toBe("1");
  });

  test("should return a domain error if outing entity is invalid", async () => {
    const input = makeInput();
    input.serviceFee = -1;
    input.name = "";

    const output = await createOutingUseCase.execute(input);
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

  test("should return a infra error if createOutingRepository fails", async () => {
    const input = makeInput();
    createOutingRepository.create = jest
      .fn()
      .mockResolvedValue(EitherFactory.left(new InfraError("Error")));

    const output = await createOutingUseCase.execute(input);
    const errors = output.value as InfraError[];

    expect(output.isLeft()).toBe(true);
    expect(output.isRight()).toBe(false);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toEqual(new InfraError("Error"));
  });
});
