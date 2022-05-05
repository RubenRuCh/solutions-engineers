import { CapacityTrackCourierRepository } from '../../../Domain/Model/Interfaces/Repository/CapacityTrackCourierRepository';
import { CourierFinder } from '../../../Domain/Services/CourierFinder';
import { CapacityTrackCourierCapacity } from '../../../Domain/ValueObject/CapacityTrackCourierCapacity';
import { CapacityTrackCourierId } from '../../../Domain/ValueObject/CapacityTrackCourierId';

type UpdateCourierParams = {
  courierId: string;
  maxCapacity: number;
};

export class UpdateCourier {
  private courierFinder: CourierFinder;
  private repository: CapacityTrackCourierRepository;

  constructor(repository: CapacityTrackCourierRepository) {
    this.repository = repository;
    this.courierFinder = new CourierFinder(repository);
  }

  async run({ courierId, maxCapacity }: UpdateCourierParams): Promise<void> {
    const domainCourierId = new CapacityTrackCourierId(courierId);
    const domainMaxCapacity = new CapacityTrackCourierCapacity(maxCapacity);

    const courier = await this.courierFinder.run({ courierId: domainCourierId });
    const updatedCourier = courier.update({ newMaxCapacity: domainMaxCapacity });

    await this.repository.persist(updatedCourier);
  }
}
