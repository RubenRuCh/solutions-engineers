import { CapacityTrackCourierNotFoundException } from '../../../../../../../src/Contexts/CapacityTrack/Courier/Domain/Exception/CapacityTrackCourierNotFoundException';
import { CourierFinder } from '../../../../../../../src/Contexts/CapacityTrack/Courier/Domain/Services/CourierFinder';
import { CapacityTrackCourierRepositoryMock } from '../../../__mocks/CapacityTrackCourierRepositoryMock';
import { CapacityTrackCourierMother } from '../../Model/CapacityTrackCourierMother';
import { CapacityTrackCourierIdMother } from '../../ValueObject/CapacityTrackCourierIdMother';

let repository: CapacityTrackCourierRepositoryMock;
let finder: CourierFinder;

describe('CourierFinder', () => {
  beforeEach(() => {
    repository = new CapacityTrackCourierRepositoryMock();
    finder = new CourierFinder(repository);
  });

  it('should throw exception if courier does not exists', async () => {
    const courierId = CapacityTrackCourierIdMother.random();
    repository.whenGetByIdThenReturn(null);

    expect.assertions(3);

    let response = null;
    try {
      response = await finder.run({ courierId });
    } catch (error) {
      expect(error).toBeInstanceOf(CapacityTrackCourierNotFoundException);
    }

    repository.assertLastGetCourierByIdIs(courierId);
    expect(response).toEqual(null);
  });

  it('should return searcher courier when it exists', async () => {
    const courier = CapacityTrackCourierMother.random();
    repository.whenGetByIdThenReturn(courier);

    const response = await finder.run({ courierId: courier.id });

    repository.assertLastGetCourierByIdIs(courier.id);
    expect(response).toEqual(courier);
  });
});
