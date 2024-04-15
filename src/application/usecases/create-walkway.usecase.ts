import { CreateWalkwayUseCaseInterface } from "@/domain/usecases";
import { CreateWalkwayRepositoryProtocol } from "../protocols/create-walkway.repository.protocol";
import { left, right } from "@/domain/shared/either";

export class CreateWalkwayUseCase implements CreateWalkwayUseCaseInterface {
  constructor(
    private readonly createWalkwayRepository: CreateWalkwayRepositoryProtocol,
  ) {}

  async execute(
    input: CreateWalkwayUseCaseInterface.Input,
  ): Promise<CreateWalkwayUseCaseInterface.Output> {
    const output = await this.createWalkwayRepository.create(input);

    if (output.isLeft()) {
      const error = output.value;
      return left([error]);
    }

    const walkwayId = output.value;

    return right(walkwayId);
  }
}
