import { GetCourier } from '../../../../../../../src/Contexts/CapacityTrack/Courier/Application/Query/GetCourier/GetCourier';
import { CapacityTrackCourierNotFoundException } from '../../../../../../../src/Contexts/CapacityTrack/Courier/Domain/Exception/CapacityTrackCourierNotFoundException';
import { CapacityTrackCourierMother } from '../../../Domain/Model/CapacityTrackCourierMother';
import { CapacityTrackCourierIdMother } from '../../../Domain/ValueObject/CapacityTrackCourierIdMother';
import { CapacityTrackCourierRepositoryMock } from '../../../__mocks/CapacityTrackCourierRepositoryMock';

let repository: CapacityTrackCourierRepositoryMock;
let query: GetCourier;

describe('GetCourier', () => {
  beforeEach(() => {
    repository = new CapacityTrackCourierRepositoryMock();
    query = new GetCourier(repository);
  });

  it('should throw exception if courier does not exists', async () => {
    const courierId = CapacityTrackCourierIdMother.random();
    repository.whenGetByIdThenReturn(null);

    expect.assertions(3);

    let response = null;

    try {
      response = await query.run({ courierId: courierId.value });
    } catch (error) {
      expect(error).toBeInstanceOf(CapacityTrackCourierNotFoundException);
    }

    repository.assertLastGetCourierByIdIs(courierId);
    expect(response).toEqual(null);
  });

  it('should return searcher courier when it exists', async () => {
    const courier = CapacityTrackCourierMother.random();
    repository.whenGetByIdThenReturn(courier);

    const response = await query.run({ courierId: courier.id.value });

    repository.assertLastGetCourierByIdIs(courier.id);
    expect(response).toEqual(courier.toPrimitives());
  });
});
