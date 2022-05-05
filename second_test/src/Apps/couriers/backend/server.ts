import bodyParser from 'body-parser';
import compress from 'compression';
import errorHandler from 'errorhandler';
import express, { Request, Response } from 'express';
import Router from 'express-promise-router';
import helmet from 'helmet';
import * as http from 'http';
import httpStatus from 'http-status';
import Logger from '../../../Contexts/Shared/Domain/Logger';
import WinstonLogger from '../../../Contexts/Shared/Infraestructure/WinstonLogger';
import { registerRoutes } from './routes';

export class Server {
  private express: express.Express;
  readonly port: string;
  private logger: Logger;
  httpServer?: http.Server;

  constructor(port: string) {
    this.port = port;
    this.logger = new WinstonLogger();
    this.express = express();

    this.express.use(function (_req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, GET, DELETE, OPTIONS');
      next();
    });

    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: true }));
    this.express.use(helmet.xssFilter());
    this.express.use(helmet.noSniff());
    this.express.use(helmet.hidePoweredBy());
    this.express.use(helmet.frameguard({ action: 'deny' }));
    this.express.use(compress());
    const router = Router();
    router.use(errorHandler());
    this.express.use(router);
    registerRoutes(router);

    router.use((err: Error, _req: Request, res: Response, _next: Function) => {
      this.logger.error(err);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err.message);
    });
  }

  async listen(): Promise<void> {
    return new Promise(resolve => {
      this.httpServer = this.express.listen(this.port, () => {
        this.logger.info(
          `  Couriers Backend App is running at http://localhost:${this.port} in ${this.express.get('env')} mode`
        );
        this.logger.info('  Press CTRL-C to stop\n');
        resolve();
      });
    });
  }

  async stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.httpServer) {
        this.httpServer.close(error => {
          if (error) {
            return reject(error);
          }

          return resolve();
        });
      }

      return resolve();
    });
  }

  public get expressApp(): express.Express {
    return this.express;
  }
}
