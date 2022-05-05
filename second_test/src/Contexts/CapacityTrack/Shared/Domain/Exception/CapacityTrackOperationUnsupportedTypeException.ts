import { BaseException } from '../../../../Shared/Domain/Exception/BaseException';

export class CapacityTrackOperationUnsupportedTypeException extends BaseException {
  protected errorCode(): string {
    return 'CAPACITY_TRACK_OPERATION_UNSUPPORTED_TYPE';
  }
}
