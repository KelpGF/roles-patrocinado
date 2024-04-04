import { DomainError } from "./domain.error";
import { InfraError } from "./infra.error";
import { InvalidParamError } from "./invalid-param-error";

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

  test("should create a new instance of InvalidParamError with a message", () => {
    const paramName = "param";

    const error = new InvalidParamError(paramName);
    const error2 = new InvalidParamError(paramName, "is required");

    expect(error).toBeInstanceOf(InvalidParamError);
    expect(error.message).toBe(`Param ${paramName} is invalid`);
    expect(error.name).toBe("DomainError");

    expect(error2).toBeInstanceOf(InvalidParamError);
    expect(error2.message).toBe(`Param ${paramName} is required`);
    expect(error2.name).toBe("DomainError");
  });
});
