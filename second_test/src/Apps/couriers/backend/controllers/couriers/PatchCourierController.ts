import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { CustomRequest } from '../../../../../Contexts/Shared/Infraestructure/CustomRequest';
import { CapacityTrackCourierRepository } from '../../../../../Contexts/CapacityTrack/Courier/Domain/Model/Interfaces/Repository/CapacityTrackCourierRepository';
import { GetCourier } from '../../../../../Contexts/CapacityTrack/Courier/Application/Query/GetCourier/GetCourier';
import { UpdateCourierCurrentCapacity } from '../../../../../Contexts/CapacityTrack/Courier/Application/Command/UpdateCourierCurrentCapacity/UpdateCourierCurrentCapacity';
import { MongoCapacityTrackCourierRepository } from '../../../../../Contexts/CapacityTrack/Courier/Infraestructure/Repository/MongoCapacityTrackCourierRepository';
import { MongoClientFactory } from '../../../../../Contexts/Shared/Infraestructure/Repository/Mongo/MongoClientFactory';
import { MongoConfigFactory } from '../../../../../Contexts/CapacityTrack/Shared/Infraestructure/Repository/Mongo/MongoConfigFactory';

export class PatchCourierController {
  private courierRepository: CapacityTrackCourierRepository;
  private updateCourierCurrentCapacity: UpdateCourierCurrentCapacity;
  private getCourier: GetCourier;

  constructor() {
    this.courierRepository = new MongoCapacityTrackCourierRepository(
      MongoClientFactory.createClient('couriers', MongoConfigFactory.createConfig())
    );
    this.updateCourierCurrentCapacity = new UpdateCourierCurrentCapacity(this.courierRepository);
    this.getCourier = new GetCourier(this.courierRepository);
  }

  public async run(req: Request, res: Response): Promise<void> {
    const customReq = new CustomRequest(req);
    const courierId = customReq.getRouteParam('courierId');
    const operationType = customReq.getBodyParam('operationType');
    const packageVolume = customReq.getBodyParam('packageVolume');

    await this.updateCourierCurrentCapacity.run({ courierId, operationType, packageVolume });
    const updatedCourier = await this.getCourier.run({ courierId });

    res.status(httpStatus.OK).send(updatedCourier);
  }
}
