import { Either } from "../either";
import {
  BaseEntityAbstract,
  Params as BaseEntityAbstractParams,
} from "./base-entity.abstract";

export type CreateEntityParams<T> = T & BaseEntityAbstractParams;

export type Errors = { errors: string[] }; // TODO: Change to DomainError[]
export type CreateEntityResult<T extends BaseEntityAbstract> = Either<
  Errors,
  T
>;
