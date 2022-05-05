import { BaseException } from '../../../../Shared/Domain/Exception/BaseException';

export class CapacityTrackCurrentCourierCapacityCannotExceedMaximumCapacityException extends BaseException {
  protected errorCode(): string {
    return 'CAPACITY_TRACK_CURRENT_COURIER_CAPACITY_CANNOT_BE_ABOVE_MAXIMUM_CAPACITY';
  }
}
