import { CreateCourier } from '../../../../../../../src/Contexts/CapacityTrack/Courier/Application/Command/CreateCourier/CreateCourier';
import { CapacityTrackCourierAlreadyExistsException } from '../../../../../../../src/Contexts/CapacityTrack/Courier/Domain/Exception/CapacityTrackCourierAlreadyExistsException';
import { CapacityTrackCourierCapacityMustBeZeroOrPositiveException } from '../../../../../../../src/Contexts/CapacityTrack/Courier/Domain/Exception/CapacityTrackCourierCapacityMustBeZeroOrPositiveException';
import { CapacityTrackCourier } from '../../../../../../../src/Contexts/CapacityTrack/Courier/Domain/Model/Entities/CapacityTrackCourier';
import { InvalidIdException } from '../../../../../../../src/Contexts/Shared/Domain/Exception/InvalidIdException';
import { CapacityTrackCourierMother } from '../../../Domain/Model/CapacityTrackCourierMother';
import { CapacityTrackCourierCapacityMother } from '../../../Domain/ValueObject/CapacityTrackCourierCapacityMother';
import { CapacityTrackCourierIdMother } from '../../../Domain/ValueObject/CapacityTrackCourierIdMother';
import { CapacityTrackCourierRepositoryMock } from '../../../__mocks/CapacityTrackCourierRepositoryMock';

let repository: CapacityTrackCourierRepositoryMock;
let command: CreateCourier;

describe('CreateCourier', () => {
  beforeEach(() => {
    repository = new CapacityTrackCourierRepositoryMock();
    command = new CreateCourier(repository);
  });

  it('should create a new courier with current capacity equals to max capacity', async () => {
    const courierId = CapacityTrackCourierIdMother.random();
    const courierMaxCapacity = CapacityTrackCourierCapacityMother.random();

    await command.run({
      courierId: courierId.value,
      maxCapacity: courierMaxCapacity.value
    });

    const expectedCourier = CapacityTrackCourier.fromPrimitives({
      id: courierId.value,
      maxCapacity: courierMaxCapacity.value,
      currentCapacity: courierMaxCapacity.value
    });

    repository.assertLastPersistedCourierIs(expectedCourier);
  });

  it('should throw exception if courier already exists', async () => {
    const courier = CapacityTrackCourierMother.random();
    repository.whenGetByIdThenReturn(courier);

    expect.assertions(2);

    try {
      await command.run({
        courierId: courier.id.value,
        maxCapacity: courier.maxCapacity.value
      });
    } catch (error) {
      expect(error).toBeInstanceOf(CapacityTrackCourierAlreadyExistsException);
    }

    repository.assertPersistCourierHasNotBeenCalled();
  });

  it('should throw exception if courier id is invalid', async () => {
    const courierCapacity = CapacityTrackCourierCapacityMother.random();

    expect.assertions(2);

    try {
      await command.run({
        courierId: 'invalid-id',
        maxCapacity: courierCapacity.value
      });
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidIdException);
    }

    repository.assertPersistCourierHasNotBeenCalled();
  });

  it('should throw exception if courier capacity is invalid', async () => {
    const courierId = CapacityTrackCourierIdMother.random();

    expect.assertions(2);

    try {
      await command.run({
        courierId: courierId.value,
        maxCapacity: -1
      });
    } catch (error) {
      expect(error).toBeInstanceOf(CapacityTrackCourierCapacityMustBeZeroOrPositiveException);
    }

    repository.assertPersistCourierHasNotBeenCalled();
  });
});
