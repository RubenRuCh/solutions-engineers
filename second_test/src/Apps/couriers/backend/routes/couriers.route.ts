import express, { Express, Router } from 'express';

const router: Router = express.Router();

export const register = (app: Express) => {
  app.use('/couriers', router);
};
