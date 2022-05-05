import { CapacityTrackCourierCapacity } from '../../../../../../src/Contexts/CapacityTrack/Courier/Domain/ValueObject/CapacityTrackCourierCapacity';
import { NumberMother } from '../../../../Shared/Domain/ValueObject/NumberMother';

export class CapacityTrackCourierCapacityMother {
  static create(value: number): CapacityTrackCourierCapacity {
    return new CapacityTrackCourierCapacity(value);
  }

  static creator() {
    return () => CapacityTrackCourierCapacityMother.random();
  }

  static random(): CapacityTrackCourierCapacity {
    return this.create(NumberMother.random({ min: 1 }));
  }
}
