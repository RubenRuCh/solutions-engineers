import express, { Express, Router } from 'express';
import { AsyncHandler } from '../../../../Contexts/Shared/Infraestructure/AsyncHandler';
import { PostCourierController } from '../controllers/couriers/PostCourierController';
import { PutCourierController } from '../controllers/couriers/PutCourierController';

enum CouriersEndpoints {
  PostOne = '/',
  PutOne = '/:courierId'
}

const router: Router = express.Router();

router.post(
  CouriersEndpoints.PostOne,
  AsyncHandler((req: Request, res: Response) => new PostCourierController().run(req, res))
);

router.put(
  CouriersEndpoints.PutOne,
  AsyncHandler((req: Request, res: Response) => new PutCourierController().run(req, res))
);

export const register = (app: Express) => {
  app.use('/couriers', router);
};
