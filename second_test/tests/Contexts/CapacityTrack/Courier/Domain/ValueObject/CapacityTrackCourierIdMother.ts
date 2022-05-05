import { CapacityTrackCourierId } from '../../../../../../src/Contexts/CapacityTrack/Courier/Domain/ValueObject/CapacityTrackCourierId';
import { UuidMother } from '../../../../Shared/Domain/ValueObject/UuidMother';

export class CapacityTrackCourierIdMother {
  static create(value: string): CapacityTrackCourierId {
    return new CapacityTrackCourierId(value);
  }

  static creator() {
    return () => CapacityTrackCourierIdMother.random();
  }

  static random(): CapacityTrackCourierId {
    return this.create(UuidMother.random());
  }
}
