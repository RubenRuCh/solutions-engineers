import { NextFunction, Request, Response } from 'express';

export function AsyncHandler(fn: CallableFunction) {
  return (req: Request, res: Response, next: NextFunction): Promise<void> =>
    Promise.resolve(fn(req, res, next)).catch(next);
}
