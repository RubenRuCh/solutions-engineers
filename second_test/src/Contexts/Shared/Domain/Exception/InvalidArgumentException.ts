import { BaseException } from './BaseException';

export class InvalidArgumentException extends BaseException {
  protected errorCode(): string {
    return 'INVALID_ARGUMENT';
  }
}
