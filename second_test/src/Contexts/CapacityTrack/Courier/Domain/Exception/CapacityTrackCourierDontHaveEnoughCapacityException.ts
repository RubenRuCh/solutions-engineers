import { BaseException } from '../../../../Shared/Domain/Exception/BaseException';

export class CapacityTrackCourierDontHaveEnoughCapacityException extends BaseException {
  protected errorCode(): string {
    return 'CAPACITY_TRACK_COURIER_DONT_HAVE_ENOUGH_CAPACITY';
  }
}
