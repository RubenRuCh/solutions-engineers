export abstract class ValueObject<T extends Object> {
  private readonly _value: T;

  constructor(value: T) {
    this._value = value;
  }

  public get value(): T {
    return this._value;
  }

  public equalsTo(other: ValueObject<T>): boolean {
    return this._value === other.value;
  }

  toJSON() {
    return this.toString();
  }

  toString() {
    if (this._value) {
      return this._value.toString();
    }

    return this._value;
  }
}
