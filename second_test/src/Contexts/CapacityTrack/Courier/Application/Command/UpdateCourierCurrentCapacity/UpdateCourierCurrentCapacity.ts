import {
  CapacityTrackOperationType,
  CapacityTrackOperationTypeValue
} from '../../../../Shared/Domain/ValueObject/CapacityTrackOperationType';
import { CapacityTrackPackageVolume } from '../../../../Shared/Domain/ValueObject/CapacityTrackPackageVolume';
import { CapacityTrackCourierRepository } from '../../../Domain/Model/Interfaces/Repository/CapacityTrackCourierRepository';
import { CourierFinder } from '../../../Domain/Services/CourierFinder';
import { CapacityTrackCourierId } from '../../../Domain/ValueObject/CapacityTrackCourierId';

type UpdateCourierCurrentCapacityParams = {
  courierId: string;
  operationType: CapacityTrackOperationTypeValue;
  packageVolume: number;
};

export class UpdateCourierCurrentCapacity {
  private courierFinder: CourierFinder;
  private repository: CapacityTrackCourierRepository;

  constructor(repository: CapacityTrackCourierRepository) {
    this.repository = repository;
    this.courierFinder = new CourierFinder(repository);
  }

  async run({ courierId, operationType, packageVolume }: UpdateCourierCurrentCapacityParams): Promise<void> {
    const domainCourierId = new CapacityTrackCourierId(courierId);
    const domainOperationType = new CapacityTrackOperationType(operationType);
    const domainPackageVolume = new CapacityTrackPackageVolume(packageVolume);

    const courier = await this.courierFinder.run({ courierId: domainCourierId });

    if (domainOperationType.isDelivery) {
      courier.deliverPackage(domainPackageVolume);
    }

    if (domainOperationType.isPickup) {
      courier.pickPackage(domainPackageVolume);
    }

    await this.repository.persist(courier);
  }
}
