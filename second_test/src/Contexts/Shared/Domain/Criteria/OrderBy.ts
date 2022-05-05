import { StringValueObject } from '../ValueObject/StringValueObject';

export class OrderBy extends StringValueObject {
  constructor(value: string) {
    super(value);
  }
}
