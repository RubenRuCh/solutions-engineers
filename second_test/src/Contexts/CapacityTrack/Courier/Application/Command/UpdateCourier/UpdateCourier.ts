import { CapacityTrackCourierRepository } from '../../../Domain/Model/Interfaces/Repository/CapacityTrackCourierRepository';
import { CapacityTrackCourierCapacity } from '../../../Domain/ValueObject/CapacityTrackCourierCapacity';
import { CapacityTrackCourierId } from '../../../Domain/ValueObject/CapacityTrackCourierId';

type UpdateCourierParams = {
  courierId: string;
  maxCapacity: number;
};

export class UpdateCourier {
  private repository: CapacityTrackCourierRepository;

  constructor(repository: CapacityTrackCourierRepository) {
    this.repository = repository;
  }

  async run({ courierId, maxCapacity }: UpdateCourierParams): Promise<void> {
    const domainCourierId = new CapacityTrackCourierId(courierId);
    const domainMaxCapacity = new CapacityTrackCourierCapacity(maxCapacity);
  }
}
