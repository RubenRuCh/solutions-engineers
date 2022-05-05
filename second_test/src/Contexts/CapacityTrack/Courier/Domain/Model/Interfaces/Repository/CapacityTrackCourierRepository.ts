import { Nullable } from '../../../../../../Shared/Domain/Nullable';
import { CapacityTrackCourierId } from '../../../ValueObject/CapacityTrackCourierId';
import { CapacityTrackCourier } from '../../Entities/CapacityTrackCourier';
import { Criteria } from '../../../../../../Shared/Domain/Criteria/Criteria';

export interface CapacityTrackCourierRepository {
  persist(courier: CapacityTrackCourier): Promise<void>;
  delete(courierId: CapacityTrackCourierId): Promise<void>;
  getById(courierId: CapacityTrackCourierId): Promise<Nullable<CapacityTrackCourier>>;
  search(criteria: Criteria): Promise<CapacityTrackCourier[]>;
}
