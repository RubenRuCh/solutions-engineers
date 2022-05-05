import { BaseException } from '../../../../Shared/Domain/Exception/BaseException';

export class CapacityTrackCourierNotFoundException extends BaseException {
  protected errorCode(): string {
    return 'CAPACITY_TRACK_COURIER_NOT_FOUND';
  }
}
