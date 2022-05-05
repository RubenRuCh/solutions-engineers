import { CapacityTrackCourierDTO } from '../../../Domain/Model/DTOs/CapacityTrackCourierDTO';
import { CapacityTrackCourierRepository } from '../../../Domain/Model/Interfaces/Repository/CapacityTrackCourierRepository';
import { CourierFinder } from '../../../Domain/Services/CourierFinder';
import { CapacityTrackCourierId } from '../../../Domain/ValueObject/CapacityTrackCourierId';

export class GetCourier {
  private courierFinder: CourierFinder;

  constructor(repository: CapacityTrackCourierRepository) {
    this.courierFinder = new CourierFinder(repository);
  }

  async run({ courierId }: { courierId: string }): Promise<CapacityTrackCourierDTO> {
    const domainCourierId = new CapacityTrackCourierId(courierId);
    const courier = await this.courierFinder.run({ courierId: domainCourierId });

    return courier.toPrimitives();
  }
}
