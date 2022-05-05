import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { CustomRequest } from '../../../../../Contexts/Shared/Infraestructure/CustomRequest';
import { CapacityTrackCourierRepository } from '../../../../../Contexts/CapacityTrack/Courier/Domain/Model/Interfaces/Repository/CapacityTrackCourierRepository';
import { GetCourier } from '../../../../../Contexts/CapacityTrack/Courier/Application/Query/GetCourier/GetCourier';
import { CreateCourier } from '../../../../../Contexts/CapacityTrack/Courier/Application/Command/CreateCourier/CreateCourier';
import { MongoCapacityTrackCourierRepository } from '../../../../../Contexts/CapacityTrack/Courier/Infraestructure/Repository/MongoCapacityTrackCourierRepository';
import { MongoClientFactory } from '../../../../../Contexts/Shared/Infraestructure/Repository/Mongo/MongoClientFactory';
import { MongoConfigFactory } from '../../../../../Contexts/CapacityTrack/Shared/Infraestructure/Repository/Mongo/MongoConfigFactory';

export class PostCourierController {
  private courierRepository: CapacityTrackCourierRepository;
  private createCourier: CreateCourier;
  private getCourier: GetCourier;

  constructor() {
    this.courierRepository = new MongoCapacityTrackCourierRepository(
      MongoClientFactory.createClient('couriers', MongoConfigFactory.createConfig())
    );
    this.createCourier = new CreateCourier(this.courierRepository);
    this.getCourier = new GetCourier(this.courierRepository);
  }

  public async run(req: Request, res: Response): Promise<void> {
    const customReq = new CustomRequest(req);

    const courierId = customReq.getBodyParam('id');
    const maxCapacity = customReq.getBodyParam('max_capacity');

    await this.createCourier.run({ courierId, maxCapacity });
    const updatedCourier = await this.getCourier.run({ courierId });

    res.status(httpStatus.CREATED).send(updatedCourier);
  }
}
