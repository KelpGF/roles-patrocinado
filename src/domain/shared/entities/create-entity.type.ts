import { Either } from "../either";
import { DomainError } from "../errors";
import {
  BaseEntityAbstract,
  Params as BaseEntityAbstractParams,
} from "./base-entity.abstract";

export type CreateEntityParams<T> = T & BaseEntityAbstractParams;

export type Errors = { errors: DomainError[] };
export type CreateEntityResult<T extends BaseEntityAbstract> = Either<
  Errors,
  T
>;
