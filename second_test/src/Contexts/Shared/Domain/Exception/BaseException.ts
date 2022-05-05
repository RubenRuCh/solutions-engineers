export abstract class BaseException extends Error {
  protected abstract errorCode(): string;
}
