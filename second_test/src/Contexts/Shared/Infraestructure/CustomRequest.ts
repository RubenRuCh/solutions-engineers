import { Request } from 'express';
import { MissingMandatoryParameterException } from '../Domain/Exception/MissingMandatoryParameterException';

export class CustomRequest {
  private req: Request;

  constructor(req: Request) {
    this.req = req;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public getBodyParam(keyParam: string, isOptional = false): any | null {
    const valueParam = this.req.body[keyParam];

    if (typeof valueParam === 'undefined') {
      if (isOptional) {
        return null;
      }

      throw new MissingMandatoryParameterException(keyParam);
    }

    return valueParam;
  }

  public getRouteParam(keyParam: string): string {
    const valueParam = this.req.params[keyParam];

    if (typeof valueParam === 'undefined') {
      throw new MissingMandatoryParameterException(keyParam);
    }

    return valueParam;
  }
}
