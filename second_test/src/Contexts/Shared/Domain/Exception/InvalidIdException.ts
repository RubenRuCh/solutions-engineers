import { BaseException } from './BaseException';

export class InvalidIdException extends BaseException {
  protected errorCode(): string {
    return 'INVALID_ID';
  }
}
