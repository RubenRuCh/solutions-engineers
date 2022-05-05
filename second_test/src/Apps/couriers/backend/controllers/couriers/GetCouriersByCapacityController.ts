import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { GetCouriersByCapacity } from '../../../../../Contexts/CapacityTrack/Courier/Application/Query/GetCouriersByCapacity/GetCouriersByCapacity';
import { CapacityTrackCourierRepository } from '../../../../../Contexts/CapacityTrack/Courier/Domain/Model/Interfaces/Repository/CapacityTrackCourierRepository';
import { InMemoryCapacityTrackCourierRepository } from '../../../../../Contexts/CapacityTrack/Courier/Infraestructure/Repository/InMemoryCapacityTrackCourierRepository';
import { CustomRequest } from '../../../../../Contexts/Shared/Infraestructure/CustomRequest';

export class GetCouriersByCapacityController {
  private courierRepository: CapacityTrackCourierRepository;
  private getCouriersByCapacity: GetCouriersByCapacity;

  constructor() {
    this.courierRepository = new InMemoryCapacityTrackCourierRepository();
    this.getCouriersByCapacity = new GetCouriersByCapacity(this.courierRepository);
  }

  public async run(req: Request, res: Response): Promise<void> {
    const customReq = new CustomRequest(req);
    const capacityRequired = customReq.getBodyParam('capacity_required');

    const couriers = await this.getCouriersByCapacity.run({ capacityRequired });

    res.status(httpStatus.OK).send(couriers);
  }
}
