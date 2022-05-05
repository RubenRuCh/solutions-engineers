import { BaseException } from './BaseException';

export class MissingMandatoryParameterException extends BaseException {
  protected errorCode(): string {
    return 'MISSING_MANDATORY_ARGUMENT';
  }
}
