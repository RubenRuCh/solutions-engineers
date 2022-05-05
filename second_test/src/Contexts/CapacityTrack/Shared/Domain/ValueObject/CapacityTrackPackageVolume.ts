import { NumberValueObject } from '../../../../Shared/Domain/ValueObject/NumberValueObject';
import { CapacityTrackPackageVolumeMustBeAboveZeroException } from '../Exception/CapacityTrackPackageVolumeMustBeAboveZeroException';

export class CapacityTrackPackageVolume extends NumberValueObject {
  constructor(value: number) {
    super(value);
    this.ensureIsValid(value);
  }

  private ensureIsValid(value: number): void {
    if (!this.isValid(value)) {
      throw new CapacityTrackPackageVolumeMustBeAboveZeroException();
    }
  }

  private isValid(value: number): boolean {
    return value > 0;
  }
}
