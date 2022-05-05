import { CapacityTrackCourier } from '../../../../../../src/Contexts/CapacityTrack/Courier/Domain/Model/Entities/CapacityTrackCourier';
import { CapacityTrackCourierCapacity } from '../../../../../../src/Contexts/CapacityTrack/Courier/Domain/ValueObject/CapacityTrackCourierCapacity';
import { CapacityTrackCourierId } from '../../../../../../src/Contexts/CapacityTrack/Courier/Domain/ValueObject/CapacityTrackCourierId';
import { CapacityTrackCourierCapacityMother } from '../ValueObject/CapacityTrackCourierCapacityMother';
import { CapacityTrackCourierIdMother } from '../ValueObject/CapacityTrackCourierIdMother';

export class CapacityTrackCourierMother {
  static create(
    id: CapacityTrackCourierId,
    maxCapacity: CapacityTrackCourierCapacity,
    currentCapacity: CapacityTrackCourierCapacity
  ): CapacityTrackCourier {
    return new CapacityTrackCourier(id, maxCapacity, currentCapacity);
  }

  static random(): CapacityTrackCourier {
    const randomCapacity = CapacityTrackCourierCapacityMother.random();

    return this.create(CapacityTrackCourierIdMother.random(), randomCapacity, randomCapacity);
  }

  static withCapacity(
    courier: CapacityTrackCourier,
    maxCapacity: CapacityTrackCourierCapacity,
    currentCapacity: CapacityTrackCourierCapacity
  ): CapacityTrackCourier {
    return this.create(courier.id, maxCapacity, currentCapacity);
  }
}
