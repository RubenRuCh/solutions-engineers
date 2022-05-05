import { CapacityTrackCourier } from '../../../../../src/Contexts/CapacityTrack/Courier/Domain/Model/Entities/CapacityTrackCourier';
import { CapacityTrackCourierRepository } from '../../../../../src/Contexts/CapacityTrack/Courier/Domain/Model/Interfaces/Repository/CapacityTrackCourierRepository';
import { CapacityTrackCourierId } from '../../../../../src/Contexts/CapacityTrack/Courier/Domain/ValueObject/CapacityTrackCourierId';
import { Nullable } from '../../../../../src/Contexts/Shared/Domain/Nullable';

export class CapacityTrackCourierRepositoryMock implements CapacityTrackCourierRepository {
  private mockPersist = jest.fn();
  private mockDeleteId = jest.fn();
  private mockGetId = jest.fn();

  async persist(courier: CapacityTrackCourier): Promise<void> {
    this.mockPersist(courier);
  }

  assertLastPersistedCourierIs(expected: CapacityTrackCourier): void {
    const mock = this.mockPersist.mock;
    const lastSavedCourier = mock.calls[mock.calls.length - 1][0] as CapacityTrackCourier;

    expect(lastSavedCourier).toBeInstanceOf(CapacityTrackCourier);
    expect(lastSavedCourier.toPrimitives()).toEqual(expected.toPrimitives());
  }

  assertPersistCourierHasNotBeenCalled(): void {
    expect(this.mockPersist).not.toHaveBeenCalled();
  }

  async delete(courierId: CapacityTrackCourierId): Promise<void> {
    this.mockDeleteId(courierId);
  }

  assertLastDeletedCourierIdIs(expected: CapacityTrackCourierId): void {
    const mock = this.mockDeleteId.mock;
    const lastDeletedCourierId = mock.calls[mock.calls.length - 1][0] as CapacityTrackCourierId;

    expect(lastDeletedCourierId).toBeInstanceOf(CapacityTrackCourierId);
    expect(lastDeletedCourierId.value).toEqual(expected.value);
  }

  async getById(id: CapacityTrackCourierId): Promise<Nullable<CapacityTrackCourier>> {
    return this.mockGetId(id);
  }

  whenGetByIdThenReturn(value: Nullable<CapacityTrackCourier>): void {
    this.mockGetId.mockReturnValue(value);
  }

  assertLastGetCourierByIdIs(expected: CapacityTrackCourierId): void {
    expect(this.mockGetId).toHaveBeenCalledWith(expected);
  }
}
