import { BaseException } from '../../../../Shared/Domain/Exception/BaseException';

export class CapacityTrackPackageVolumeMustBeAboveZeroException extends BaseException {
  protected errorCode(): string {
    return 'CAPACITY_TRACK_PACKAGE_VOLUME_CANNOT_BE_EQUAL_OR_BELOW_0';
  }
}
