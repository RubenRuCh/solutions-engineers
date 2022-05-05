import { BaseException } from '../../../../Shared/Domain/Exception/BaseException';

export class CapacityTrackCourierAlreadyExistsException extends BaseException {
  protected errorCode(): string {
    return 'CAPACITY_TRACK_COURIER_ALREADY_EXISTS';
  }
}
