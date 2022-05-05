import { Response } from 'express';
import httpStatus from 'http-status';
import { CapacityTrackCourierAlreadyExistsException } from '../../CapacityTrack/Courier/Domain/Exception/CapacityTrackCourierAlreadyExistsException';
import { CapacityTrackCourierCapacityMustBeZeroOrPositiveException } from '../../CapacityTrack/Courier/Domain/Exception/CapacityTrackCourierCapacityMustBeZeroOrPositiveException';
import { CapacityTrackCourierDontHaveEnoughCapacityException } from '../../CapacityTrack/Courier/Domain/Exception/CapacityTrackCourierDontHaveEnoughCapacityException';
import { CapacityTrackCourierNotFoundException } from '../../CapacityTrack/Courier/Domain/Exception/CapacityTrackCourierNotFoundException';
import { CapacityTrackCurrentCourierCapacityCannotExceedMaximumCapacityException } from '../../CapacityTrack/Courier/Domain/Exception/CapacityTrackCurrentCourierCapacityCannotExceedMaximumCapacityException';
import { CapacityTrackOperationUnsupportedTypeException } from '../../CapacityTrack/Shared/Domain/Exception/CapacityTrackOperationUnsupportedTypeException';
import { CapacityTrackPackageVolumeMustBeAboveZeroException } from '../../CapacityTrack/Shared/Domain/Exception/CapacityTrackPackageVolumeMustBeAboveZeroException';
import { BaseException } from '../Domain/Exception/BaseException';
import { InvalidArgumentException } from '../Domain/Exception/InvalidArgumentException';
import { InvalidIdException } from '../Domain/Exception/InvalidIdException';
import { MissingMandatoryParameterException } from '../Domain/Exception/MissingMandatoryParameterException';

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
    case CapacityTrackCourierNotFoundException:
      return httpStatus.NOT_FOUND;

    case MissingMandatoryParameterException:
    case InvalidIdException:
    case CapacityTrackCourierCapacityMustBeZeroOrPositiveException:
    case CapacityTrackCourierAlreadyExistsException:
    case CapacityTrackOperationUnsupportedTypeException:
    case CapacityTrackPackageVolumeMustBeAboveZeroException:
    case CapacityTrackCourierDontHaveEnoughCapacityException:
    case CapacityTrackCurrentCourierCapacityCannotExceedMaximumCapacityException:
    case InvalidArgumentException:
      return httpStatus.BAD_REQUEST;

    default:
      return httpStatus.INTERNAL_SERVER_ERROR;
  }
};
