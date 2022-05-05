import { CapacityTrackCourierAlreadyExistsException } from '../../../Domain/Exception/CapacityTrackCourierAlreadyExistsException';
import { CapacityTrackCourier } from '../../../Domain/Model/Entities/CapacityTrackCourier';
import { CapacityTrackCourierRepository } from '../../../Domain/Model/Interfaces/Repository/CapacityTrackCourierRepository';
import { CapacityTrackCourierCapacity } from '../../../Domain/ValueObject/CapacityTrackCourierCapacity';
import { CapacityTrackCourierId } from '../../../Domain/ValueObject/CapacityTrackCourierId';

type CreateCourierParams = {
  courierId: string;
  maxCapacity: number;
};

export class CreateCourier {
  constructor(private repository: CapacityTrackCourierRepository) {}

  async run({ courierId, maxCapacity }: CreateCourierParams): Promise<void> {
    const domainCourierId = new CapacityTrackCourierId(courierId);

    const existingCourier = await this.repository.getById(domainCourierId);

    if (existingCourier) {
      throw new CapacityTrackCourierAlreadyExistsException();
    }

    const courier = CapacityTrackCourier.create(
      new CapacityTrackCourierId(courierId),
      new CapacityTrackCourierCapacity(maxCapacity)
    );

    await this.repository.persist(courier);
  }
}
