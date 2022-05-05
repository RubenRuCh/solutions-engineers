import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { CustomRequest } from '../../../../../Contexts/Shared/Infraestructure/CustomRequest';
import { CapacityTrackCourierRepository } from '../../../../../Contexts/CapacityTrack/Courier/Domain/Model/Interfaces/Repository/CapacityTrackCourierRepository';
import { DeleteCourier } from '../../../../../Contexts/CapacityTrack/Courier/Application/Command/DeleteCourier/DeleteCourier';
import { MongoCapacityTrackCourierRepository } from '../../../../../Contexts/CapacityTrack/Courier/Infraestructure/Repository/MongoCapacityTrackCourierRepository';
import { MongoClientFactory } from '../../../../../Contexts/Shared/Infraestructure/Repository/Mongo/MongoClientFactory';
import { MongoConfigFactory } from '../../../../../Contexts/CapacityTrack/Shared/Infraestructure/Repository/Mongo/MongoConfigFactory';

export class DeleteCourierController {
  private courierRepository: CapacityTrackCourierRepository;
  private deleteCourier: DeleteCourier;

  constructor() {
    this.courierRepository = new MongoCapacityTrackCourierRepository(
      MongoClientFactory.createClient('couriers', MongoConfigFactory.createConfig())
    );
    this.deleteCourier = new DeleteCourier(this.courierRepository);
  }

  public async run(req: Request, res: Response): Promise<void> {
    const customReq = new CustomRequest(req);
    const courierId = customReq.getRouteParam('courierId');

    await this.deleteCourier.run({ courierId });

    res.status(httpStatus.NO_CONTENT).send();
  }
}
