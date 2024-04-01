export class InvalidParamError extends Error {
  constructor(paramName: string, message?: string) {
    super(`Param ${paramName} ${message || "is invalid"}`);
    this.name = "InvalidParamError";
  }
}
