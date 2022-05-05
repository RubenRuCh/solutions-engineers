import { StringValueObject } from '../ValueObject/StringValueObject';

export class FilterValue extends StringValueObject {
  constructor(value: string) {
    super(value);
  }
}
