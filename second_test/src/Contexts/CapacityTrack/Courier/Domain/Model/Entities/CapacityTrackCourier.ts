import { AggregateRoot } from '../../../../../Shared/Domain/AggregateRoot';
import { CapacityTrackCourierId } from '../../ValueObject/CapacityTrackCourierId';
import { CapacityTrackCourierDTO } from '../DTOs/CapacityTrackCourierDTO';
import { CapacityTrackCourierCapacity } from '../../ValueObject/CapacityTrackCourierCapacity';
import { CapacityTrackPackageVolume } from '../../../../Shared/Domain/ValueObject/CapacityTrackPackageVolume';
import { CapacityTrackOperationType } from '../../../../Shared/Domain/ValueObject/CapacityTrackOperationType';
import { CapacityTrackCourierDontHaveEnoughCapacityException } from '../../Exception/CapacityTrackCourierDontHaveEnoughCapacityException';
import { CapacityTrackCurrentCourierCapacityCannotExceedMaximumCapacityException } from '../../Exception/CapacityTrackCurrentCourierCapacityCannotExceedMaximumCapacityException';

export class CapacityTrackCourier extends AggregateRoot {
  private _id: CapacityTrackCourierId;
  private _maxCapacity: CapacityTrackCourierCapacity;
  private _currentCapacity: CapacityTrackCourierCapacity;

  constructor(
    id: CapacityTrackCourierId,
    maxCapacity: CapacityTrackCourierCapacity,
    currentCapacity: CapacityTrackCourierCapacity
  ) {
    super();
    this._id = id;
    this._maxCapacity = maxCapacity;
    this._currentCapacity = currentCapacity;
  }

  static create(id: CapacityTrackCourierId, maxCapacity: CapacityTrackCourierCapacity): CapacityTrackCourier {
    const courier = new CapacityTrackCourier(id, maxCapacity, maxCapacity);

    return courier;
  }

  public get id(): CapacityTrackCourierId {
    return this._id;
  }

  public get maxCapacity(): CapacityTrackCourierCapacity {
    return this._maxCapacity;
  }

  public get currentCapacity(): CapacityTrackCourierCapacity {
    return this._currentCapacity;
  }

  static fromPrimitives(plainData: CapacityTrackCourierDTO): CapacityTrackCourier {
    return new CapacityTrackCourier(
      new CapacityTrackCourierId(plainData.id),
      new CapacityTrackCourierCapacity(plainData.maxCapacity),
      new CapacityTrackCourierCapacity(plainData.currentCapacity)
    );
  }

  public toPrimitives(): CapacityTrackCourierDTO {
    return {
      id: this.id.value,
      maxCapacity: this.maxCapacity.value,
      currentCapacity: this.currentCapacity.value
    };
  }

  public update({ newMaxCapacity }: { newMaxCapacity: CapacityTrackCourierCapacity }): CapacityTrackCourier {
    const isDeliveringSomething = this.isDeliveringSomething();
    const oldMaxCapacity = this.maxCapacity;
    this._maxCapacity = newMaxCapacity;

    if (!isDeliveringSomething) {
      this._currentCapacity = newMaxCapacity;

      return this;
    }

    const isDecreasingCapacity = newMaxCapacity.isSmallerThan(oldMaxCapacity);

    if (isDecreasingCapacity) {
      this._currentCapacity = this.currentCapacity.decrement(newMaxCapacity.value);

      return this;
    }

    this._currentCapacity = newMaxCapacity.decrement(this.currentCapacity.value);

    return this;
  }

  private isDeliveringSomething(): boolean {
    return this.currentCapacity.isSmallerThan(this.maxCapacity);
  }

  public pickPackage(packageVolume: CapacityTrackPackageVolume): void {
    this.ensurePickupIsViable(packageVolume);
    this.updateCurrentCapacity(packageVolume.value, CapacityTrackOperationType.newPickup());
  }

  public deliverPackage(packageVolume: CapacityTrackPackageVolume): void {
    this.updateCurrentCapacity(packageVolume.value, CapacityTrackOperationType.newDelivery());
  }

  private updateCurrentCapacity(operationCost: number, operation: CapacityTrackOperationType): void {
    const newCapacityValue = operation.isPickup
      ? this.currentCapacity.decrement(operationCost)
      : this.currentCapacity.increment(operationCost);

    if (newCapacityValue.isBiggerThan(this.maxCapacity)) {
      /* Maybe just set current capacity to max capacity instead of throwing exception,
        since in this case the courier is delivering a package that was already picked up */
      throw new CapacityTrackCurrentCourierCapacityCannotExceedMaximumCapacityException();
    }

    this._currentCapacity = newCapacityValue;
  }

  private ensurePickupIsViable(packageVolume: CapacityTrackPackageVolume): void {
    if (!this.isPickupViable(packageVolume)) {
      throw new CapacityTrackCourierDontHaveEnoughCapacityException();
    }
  }

  private isPickupViable(packageVolume: CapacityTrackPackageVolume): boolean {
    return this.currentCapacity.isBiggerThan(packageVolume) || this.currentCapacity.isEqual(packageVolume);
  }
}
