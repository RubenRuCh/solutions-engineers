import { CapacityTrackCourierRepository } from '../../../Domain/Model/Interfaces/Repository/CapacityTrackCourierRepository';
import { CourierFinder } from '../../../Domain/Services/CourierFinder';
import { CapacityTrackCourierId } from '../../../Domain/ValueObject/CapacityTrackCourierId';

type DeleteCourierParams = {
  courierId: string;
};

export class DeleteCourier {
  private courierFinder: CourierFinder;
  private repository: CapacityTrackCourierRepository;

  constructor(repository: CapacityTrackCourierRepository) {
    this.repository = repository;
    this.courierFinder = new CourierFinder(repository);
  }

  async run({ courierId }: DeleteCourierParams): Promise<void> {
    const domainCourierId = new CapacityTrackCourierId(courierId);

    const courier = await this.courierFinder.run({ courierId: domainCourierId });
    await this.repository.delete(courier.id);
  }
}
