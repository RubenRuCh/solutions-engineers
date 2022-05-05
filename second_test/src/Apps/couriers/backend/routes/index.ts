import httpStatus from 'http-status';
import glob from 'glob';
import { NextFunction, Router, Response, Request } from 'express';
import { ExceptionHandler } from '../../../../Contexts/Shared/Infraestructure/ExceptionHandler';

export function registerRoutes(router: Router) {
  router.get('/', (_req, res) => {
    res.send({ message: 'Welcome to Stuart Couriers API!' });
  });

  const routes = glob.sync(__dirname + '/**/*.route.*');
  routes.map(route => register(route, router));

  router.use((error: Error, _req: Request, res: Response, next: NextFunction) => {
    ExceptionHandler(error, res);
    next();
  });

  router.get('*', (_req, res) => {
    res.status(httpStatus.METHOD_NOT_ALLOWED).send();
  });
}

function register(routePath: string, router: Router) {
  const route = require(routePath);
  route.register(router);
}
