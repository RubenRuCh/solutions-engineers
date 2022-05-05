import WinstonLogger from '../../../../src/Contexts/Shared/Infraestructure/WinstonLogger';

describe('WinstonLogger', () => {
  const winstonLogger = new WinstonLogger();

  it('should log a debug message', () => {
    winstonLogger.debug('debug message');
  });

  it('should log an error message', () => {
    winstonLogger.error('error message');
  });

  it('should log an info message', () => {
    winstonLogger.info('info message');
  });
});
