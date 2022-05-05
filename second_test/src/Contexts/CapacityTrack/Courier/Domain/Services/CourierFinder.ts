import { CapacityTrackCourierNotFoundException } from '../Exception/CapacityTrackCourierNotFoundException';
import { CapacityTrackCourier } from '../Model/Entities/CapacityTrackCourier';
import { CapacityTrackCourierRepository } from '../Model/Interfaces/Repository/CapacityTrackCourierRepository';
import { CapacityTrackCourierId } from '../ValueObject/CapacityTrackCourierId';

export class CourierFinder {
  constructor(private repository: CapacityTrackCourierRepository) {}

  async run({ courierId }: { courierId: CapacityTrackCourierId }): Promise<CapacityTrackCourier> {
    const courier = await this.repository.getById(courierId);

    if (!courier) {
      throw new CapacityTrackCourierNotFoundException();
    }

    return courier;
  }
}
