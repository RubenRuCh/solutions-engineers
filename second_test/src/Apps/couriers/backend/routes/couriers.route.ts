import express, { Express, Router } from 'express';
import { AsyncHandler } from '../../../../Contexts/Shared/Infraestructure/AsyncHandler';
import { PostCourierController } from '../controllers/couriers/PostCourierController';

enum CouriersEndpoints {
  PostOne = '/'
}

const router: Router = express.Router();

router.post(
  CouriersEndpoints.PostOne,
  AsyncHandler((req: Request, res: Response) => new PostCourierController().run(req, res))
);

export const register = (app: Express) => {
  app.use('/couriers', router);
};
