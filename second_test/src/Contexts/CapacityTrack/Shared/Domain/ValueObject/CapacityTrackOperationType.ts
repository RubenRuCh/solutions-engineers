import { ValueObject } from '../../../../Shared/Domain/ValueObject/ValueObject';
import { CapacityTrackOperationUnsupportedTypeException } from '../Exception/CapacityTrackOperationUnsupportedTypeException';

export type CapacityTrackOperationTypeValue = 'delivery' | 'pickup';

export class CapacityTrackOperationType extends ValueObject<CapacityTrackOperationTypeValue> {
  constructor(value: CapacityTrackOperationTypeValue) {
    super(value);
    this.ensureIsValid(value);
  }

  public get isDelivery(): boolean {
    return this.value === 'delivery';
  }

  public get isPickup(): boolean {
    return this.value === 'pickup';
  }

  public static newDelivery(): CapacityTrackOperationType {
    return new CapacityTrackOperationType('delivery');
  }

  public static newPickup(): CapacityTrackOperationType {
    return new CapacityTrackOperationType('pickup');
  }

  private ensureIsValid(value: CapacityTrackOperationTypeValue): void {
    if (!this.isValid(value)) {
      throw new CapacityTrackOperationUnsupportedTypeException();
    }
  }

  private isValid(value: CapacityTrackOperationTypeValue): boolean {
    return value === 'pickup' || value === 'delivery';
  }
}
