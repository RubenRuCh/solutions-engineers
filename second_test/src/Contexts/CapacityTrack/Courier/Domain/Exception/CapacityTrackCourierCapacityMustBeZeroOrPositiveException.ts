import { BaseException } from '../../../../Shared/Domain/Exception/BaseException';

export class CapacityTrackCourierCapacityMustBeZeroOrPositiveException extends BaseException {
  protected errorCode(): string {
    return 'CAPACITY_TRACK_COURIER_CAPACITY_CANNOT_BE_BELOW_0';
  }
}
