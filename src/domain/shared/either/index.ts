export type Either<L, R> = Left<L, R> | Right<L, R>;

class Left<L, R> {
  constructor(private readonly _value: L) {}

  get value() {
    return this._value;
  }

  isLeft(): this is Left<L, R> {
    return true;
  }

  isRight(): this is Right<L, R> {
    return false;
  }
}

class Right<L, R> {
  constructor(private readonly _value: R) {}

  get value() {
    return this._value;
  }

  isLeft(): this is Left<L, R> {
    return false;
  }

  isRight(): this is Right<L, R> {
    return true;
  }
}

export const left = <L, R>(l: L): Either<L, R> => new Left(l);
export const right = <L, R>(r: R): Either<L, R> => new Right(r);
