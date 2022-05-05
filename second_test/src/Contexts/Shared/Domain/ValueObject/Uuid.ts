import { v4 } from 'uuid';
import validate from 'uuid-validate';
import { InvalidIdException } from '../Exception/InvalidIdException';

export class Uuid {
  readonly value: string;

  constructor(value: string) {
    this.ensureIsValidUuid(value);

    this.value = value;
  }

  static random(): Uuid {
    return new Uuid(v4());
  }

  private ensureIsValidUuid(id: string): void {
    if (!validate(id)) {
      throw new InvalidIdException(`<${this.constructor.name}> does not allow the value <${id}>`);
    }
  }

  public isEqual(id: Uuid): boolean {
    return this.value === id.value;
  }

  toString(): string {
    return this.value;
  }
}
