import { DeleteCourier } from '../../../../../../../src/Contexts/CapacityTrack/Courier/Application/Command/DeleteCourier/DeleteCourier';
import { CapacityTrackCourierNotFoundException } from '../../../../../../../src/Contexts/CapacityTrack/Courier/Domain/Exception/CapacityTrackCourierNotFoundException';
import { CapacityTrackCourierMother } from '../../../Domain/Model/CapacityTrackCourierMother';
import { CapacityTrackCourierIdMother } from '../../../Domain/ValueObject/CapacityTrackCourierIdMother';
import { CapacityTrackCourierRepositoryMock } from '../../../__mocks/CapacityTrackCourierRepositoryMock';

let repository: CapacityTrackCourierRepositoryMock;
let command: DeleteCourier;

describe('DeleteCourier', () => {
  beforeEach(() => {
    repository = new CapacityTrackCourierRepositoryMock();
    command = new DeleteCourier(repository);
  });

  it('should delete a courier', async () => {
    const courier = CapacityTrackCourierMother.random();
    repository.whenGetByIdThenReturn(courier);

    await command.run({ courierId: courier.id.value });

    repository.assertLastDeletedCourierIdIs(courier.id);
  });

  it('should throw exception if courier does not exists', async () => {
    const courierId = CapacityTrackCourierIdMother.random();
    repository.whenGetByIdThenReturn(null);

    expect.assertions(2);

    try {
      await command.run({ courierId: courierId.value });
    } catch (error) {
      expect(error).toBeInstanceOf(CapacityTrackCourierNotFoundException);
    }

    repository.assertLastGetCourierByIdIs(courierId);
  });

});
