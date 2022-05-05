import { NumberValueObject } from '../../../../Shared/Domain/ValueObject/NumberValueObject';
import { CapacityTrackCourierCapacityMustBeZeroOrPositiveException } from '../Exception/CapacityTrackCourierCapacityMustBeZeroOrPositiveException';

export class CapacityTrackCourierCapacity extends NumberValueObject {
  constructor(value: number) {
    super(value);
    this.ensureIsValid(value);
  }

  private ensureIsValid(value: number): void {
    if (!this.isValid(value)) {
      throw new CapacityTrackCourierCapacityMustBeZeroOrPositiveException();
    }
  }

  private isValid(value: number): boolean {
    return value >= 0;
  }
}
