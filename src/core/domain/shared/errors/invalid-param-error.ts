import { DomainError } from "./domain.error";

export class InvalidParamError extends DomainError {
  constructor(paramName: string, message?: string) {
    super(`Param ${paramName} ${message || "is invalid"}`);
  }
}
