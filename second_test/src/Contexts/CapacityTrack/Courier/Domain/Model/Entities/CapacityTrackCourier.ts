import { AggregateRoot } from '../../../../../Shared/Domain/AggregateRoot';
import { CapacityTrackCourierId } from '../../ValueObject/CapacityTrackCourierId';
import { CapacityTrackCourierDTO } from '../DTOs/CapacityTrackCourierDTO';
import { CapacityTrackCourierCapacity } from '../../ValueObject/CapacityTrackCourierCapacity';

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
}
