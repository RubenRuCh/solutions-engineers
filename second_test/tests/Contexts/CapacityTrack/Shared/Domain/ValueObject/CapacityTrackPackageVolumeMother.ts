import { CapacityTrackPackageVolume } from '../../../../../../src/Contexts/CapacityTrack/Shared/Domain/ValueObject/CapacityTrackPackageVolume';
import { NumberMother } from '../../../../Shared/Domain/ValueObject/NumberMother';

export class CapacityTrackPackageVolumeMother {
  static create(value: number): CapacityTrackPackageVolume {
    return new CapacityTrackPackageVolume(value);
  }

  static creator() {
    return () => CapacityTrackPackageVolumeMother.random();
  }

  static random(): CapacityTrackPackageVolume {
    return this.create(NumberMother.random({ min: 1 }));
  }
}
