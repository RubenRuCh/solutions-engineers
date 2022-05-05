import { Response } from 'express';
import httpStatus from 'http-status';
import { BaseException } from '../Domain/Exception/BaseException';

export const ExceptionHandler = (error: Error, res: Response): void => {
  if (error instanceof BaseException) {
    const httpCode = domainCodeToHttpCode(error);

    res.status(httpCode).json({
      error: error.message,
      errorType: error.constructor.name
    });
  } else {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: 'Unknown error',
      name: error.name,
      message: error.message,
      stack: error.stack
    });
  }
};

const domainCodeToHttpCode = (exception: BaseException) => {
  switch (exception.constructor) {
    default:
      return httpStatus.INTERNAL_SERVER_ERROR;
  }
};
