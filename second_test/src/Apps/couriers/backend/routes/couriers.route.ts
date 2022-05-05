import express, { Express, Router, Request, Response } from 'express';
import { AsyncHandler } from '../../../../Contexts/Shared/Infraestructure/AsyncHandler';
import { DeleteCourierController } from '../controllers/couriers/DeleteCourierController';
import { GetCouriersByCapacityController } from '../controllers/couriers/GetCouriersByCapacityController';
import { PatchCourierController } from '../controllers/couriers/PatchCourierController';
import { PostCourierController } from '../controllers/couriers/PostCourierController';
import { PutCourierController } from '../controllers/couriers/PutCourierController';

enum CouriersEndpoints {
  PostOne = '/',
  PutOne = '/:courierId',
  PatchOne = '/:courierId',
  DeleteOne = '/:courierId',
  GetByCapacity = '/lookup'
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

router.patch(
  CouriersEndpoints.PatchOne,
  AsyncHandler((req: Request, res: Response) => new PatchCourierController().run(req, res))
);

router.delete(
  CouriersEndpoints.DeleteOne,
  AsyncHandler((req: Request, res: Response) => new DeleteCourierController().run(req, res))
);

router.get(
  CouriersEndpoints.GetByCapacity,
  AsyncHandler((req: Request, res: Response) => new GetCouriersByCapacityController().run(req, res))
);

export const register = (app: Express) => {
  app.use('/couriers', router);
};
