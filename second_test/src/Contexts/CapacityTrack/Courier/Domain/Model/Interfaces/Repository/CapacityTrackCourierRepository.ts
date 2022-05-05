import { Nullable } from '../../../../../../Shared/Domain/Nullable';
import { CapacityTrackCourierId } from '../../../ValueObject/CapacityTrackCourierId';
import { CapacityTrackCourier } from '../../Entities/CapacityTrackCourier';

export interface CapacityTrackCourierRepository {
  persist(courier: CapacityTrackCourier): Promise<void>;
  getById(courierId: CapacityTrackCourierId): Promise<Nullable<CapacityTrackCourier>>;
}
