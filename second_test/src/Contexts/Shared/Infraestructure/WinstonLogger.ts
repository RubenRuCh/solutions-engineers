import winston, { Logger as WinstonLoggerType } from 'winston';
import Logger from '../Domain/Logger';

enum LEVELS {
  DEBUG = 'debug',
  ERROR = 'error',
  INFO = 'info'
}

class WinstonLogger implements Logger {
  private logger: WinstonLoggerType;

  constructor() {
    this.logger = winston.createLogger({
      format: winston.format.combine(
        winston.format.prettyPrint(),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.colorize(),
        winston.format.simple()
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: `logs/${LEVELS.DEBUG}.log`, level: LEVELS.DEBUG }),
        new winston.transports.File({ filename: `logs/${LEVELS.ERROR}.log`, level: LEVELS.ERROR }),
        new winston.transports.File({ filename: `logs/${LEVELS.INFO}.log`, level: LEVELS.INFO })
      ]
    });
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  error(message: string | Error) {
    this.logger.error(message);
  }

  info(message: string) {
    this.logger.info(message);
  }
}

export default WinstonLogger;
