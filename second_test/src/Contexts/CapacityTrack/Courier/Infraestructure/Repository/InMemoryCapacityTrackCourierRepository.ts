import { Nullable } from '../../../../Shared/Domain/Nullable';
import { CapacityTrackCourier } from '../../Domain/Model/Entities/CapacityTrackCourier';
import { CapacityTrackCourierRepository } from '../../Domain/Model/Interfaces/Repository/CapacityTrackCourierRepository';
import { CapacityTrackCourierId } from '../../Domain/ValueObject/CapacityTrackCourierId';

export class InMemoryCapacityTrackCourierRepository implements CapacityTrackCourierRepository {
  private static couriers: CapacityTrackCourier[] = [];

  public async persist(courierToSave: CapacityTrackCourier): Promise<void> {
    const searchedCourier = await this.getById(courierToSave.id);

    if (!searchedCourier) {
      InMemoryCapacityTrackCourierRepository.couriers.push(courierToSave);
      return;
    }

    const currentCouriers = [...InMemoryCapacityTrackCourierRepository.couriers];
    const index = currentCouriers.findIndex(courier => courier.id.isEqual(courierToSave.id));
    currentCouriers[index] = courierToSave;

    InMemoryCapacityTrackCourierRepository.couriers = currentCouriers;
  }

  public async getById(courierId: CapacityTrackCourierId): Promise<Nullable<CapacityTrackCourier>> {
    const courier = InMemoryCapacityTrackCourierRepository.couriers.find(storedCourier =>
      storedCourier.id.isEqual(courierId)
    );

    if (!courier) {
      return null;
    }

    const clonedCourier = new CapacityTrackCourier(courier.id, courier.maxCapacity, courier.currentCapacity);

    return clonedCourier;
  }

  public async clear(): Promise<void> {
    InMemoryCapacityTrackCourierRepository.couriers = [];
  }
}
