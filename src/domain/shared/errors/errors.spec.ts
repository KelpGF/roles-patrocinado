import { DomainError } from "./domain.error";
import { InfraError } from "./infra.error";

describe("Domain shared errors", () => {
  test("should create a new instance of DomainError with a message", () => {
    const message = "An error has occurred";

    const error = new DomainError(message);

    expect(error).toBeInstanceOf(DomainError);
    expect(error.message).toBe(message);
    expect(error.name).toBe("DomainError");
  });

  test("should create a new instance of InfraError with a message", () => {
    const message = "An error has occurred";

    const error = new InfraError(message);

    expect(error).toBeInstanceOf(InfraError);
    expect(error.message).toBe(message);
    expect(error.name).toBe("InfraError");
  });
});
