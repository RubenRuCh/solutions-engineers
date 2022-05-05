import { UpdateCourier } from '../../../../../../../src/Contexts/CapacityTrack/Courier/Application/Command/UpdateCourier/UpdateCourier';
import { CapacityTrackCourierCapacityMustBeZeroOrPositiveException } from '../../../../../../../src/Contexts/CapacityTrack/Courier/Domain/Exception/CapacityTrackCourierCapacityMustBeZeroOrPositiveException';
import { CapacityTrackCourierNotFoundException } from '../../../../../../../src/Contexts/CapacityTrack/Courier/Domain/Exception/CapacityTrackCourierNotFoundException';
import { CapacityTrackCourier } from '../../../../../../../src/Contexts/CapacityTrack/Courier/Domain/Model/Entities/CapacityTrackCourier';
import { CapacityTrackCourierMother } from '../../../Domain/Model/CapacityTrackCourierMother';
import { CapacityTrackCourierCapacityMother } from '../../../Domain/ValueObject/CapacityTrackCourierCapacityMother';
import { CapacityTrackCourierIdMother } from '../../../Domain/ValueObject/CapacityTrackCourierIdMother';
import { CapacityTrackCourierRepositoryMock } from '../../../__mocks/CapacityTrackCourierRepositoryMock';

let repository: CapacityTrackCourierRepositoryMock;
let command: UpdateCourier;

describe('UpdateCourier', () => {
  beforeEach(() => {
    repository = new CapacityTrackCourierRepositoryMock();
    command = new UpdateCourier(repository);
  });

  it('should update max capacity of an existing courier', async () => {
    const courierId = CapacityTrackCourierIdMother.random();
    const oldMaxCapacity = CapacityTrackCourierCapacityMother.create(10);
    const oldCurrentCapacity = CapacityTrackCourierCapacityMother.create(10);

    const courier = CapacityTrackCourierMother.create(courierId, oldMaxCapacity, oldCurrentCapacity);

    repository.whenGetByIdThenReturn(courier);

    const newMaxCapacity = CapacityTrackCourierCapacityMother.create(200);

    await command.run({
      courierId: courier.id.value,
      maxCapacity: newMaxCapacity.value
    });

    const expectedCourier = CapacityTrackCourier.fromPrimitives({
      id: courier.id.value,
      maxCapacity: newMaxCapacity.value,
      currentCapacity: newMaxCapacity.value
    });

    repository.assertLastPersistedCourierIs(expectedCourier);
  });

  it('should increment max capacity of an existing courier while incrementing proportional old current capacity if current capacity was below max', async () => {
    const courierId = CapacityTrackCourierIdMother.random();
    const oldMaxCapacity = CapacityTrackCourierCapacityMother.create(10);
    const oldCurrentCapacity = CapacityTrackCourierCapacityMother.create(5);

    const courier = CapacityTrackCourierMother.create(courierId, oldMaxCapacity, oldCurrentCapacity);

    repository.whenGetByIdThenReturn(courier);

    const newMaxCapacity = CapacityTrackCourierCapacityMother.create(200);
    const expectedNewCurrentCapacity = CapacityTrackCourierCapacityMother.create(195);

    await command.run({
      courierId: courier.id.value,
      maxCapacity: newMaxCapacity.value
    });

    const expectedCourier = CapacityTrackCourier.fromPrimitives({
      id: courier.id.value,
      maxCapacity: newMaxCapacity.value,
      currentCapacity: expectedNewCurrentCapacity.value
    });

    repository.assertLastPersistedCourierIs(expectedCourier);
  });

  it('should decrement max capacity of an existing courier while decrementing proportional old current capacity if current capacity was below max', async () => {
    const courierId = CapacityTrackCourierIdMother.random();
    const oldMaxCapacity = CapacityTrackCourierCapacityMother.create(10);
    const oldCurrentCapacity = CapacityTrackCourierCapacityMother.create(5);

    const courier = CapacityTrackCourierMother.create(courierId, oldMaxCapacity, oldCurrentCapacity);

    repository.whenGetByIdThenReturn(courier);

    const newMaxCapacity = CapacityTrackCourierCapacityMother.create(5);
    const expectedNewCurrentCapacity = CapacityTrackCourierCapacityMother.create(0);

    await command.run({
      courierId: courier.id.value,
      maxCapacity: newMaxCapacity.value
    });

    const expectedCourier = CapacityTrackCourier.fromPrimitives({
      id: courier.id.value,
      maxCapacity: newMaxCapacity.value,
      currentCapacity: expectedNewCurrentCapacity.value
    });

    repository.assertLastPersistedCourierIs(expectedCourier);
  });

  it('should throw exception when trying to decrement max capacity of a courier below 0', async () => {
    const courier = CapacityTrackCourierMother.random();

    expect.assertions(2);

    try {
      await command.run({
        courierId: courier.id.value,
        maxCapacity: -1
      });
    } catch (error) {
      expect(error).toBeInstanceOf(CapacityTrackCourierCapacityMustBeZeroOrPositiveException);
    }

    repository.assertPersistCourierHasNotBeenCalled();
  });

  it('should throw exception when trying to decrease max capacity of a courier that is delivering something that takes all its capacity', async () => {
    const courierId = CapacityTrackCourierIdMother.random();
    const oldMaxCapacity = CapacityTrackCourierCapacityMother.create(10);
    const oldCurrentCapacity = CapacityTrackCourierCapacityMother.create(0);

    const courier = CapacityTrackCourierMother.create(courierId, oldMaxCapacity, oldCurrentCapacity);

    repository.whenGetByIdThenReturn(courier);

    const newMaxCapacity = CapacityTrackCourierCapacityMother.create(5);

    expect.assertions(2);

    try {
      await command.run({
        courierId: courier.id.value,
        maxCapacity: newMaxCapacity.value
      });
    } catch (error) {
      expect(error).toBeInstanceOf(CapacityTrackCourierCapacityMustBeZeroOrPositiveException);
    }

    repository.assertPersistCourierHasNotBeenCalled();
  });

  it('should throw exception when trying to decrease max capacity of a courier that is delivering something that takes almost all its capacity', async () => {
    const courierId = CapacityTrackCourierIdMother.random();
    const oldMaxCapacity = CapacityTrackCourierCapacityMother.create(10);
    const oldCurrentCapacity = CapacityTrackCourierCapacityMother.create(1);

    const courier = CapacityTrackCourierMother.create(courierId, oldMaxCapacity, oldCurrentCapacity);

    repository.whenGetByIdThenReturn(courier);

    const newMaxCapacity = CapacityTrackCourierCapacityMother.create(5);

    expect.assertions(2);

    try {
      await command.run({
        courierId: courier.id.value,
        maxCapacity: newMaxCapacity.value
      });
    } catch (error) {
      expect(error).toBeInstanceOf(CapacityTrackCourierCapacityMustBeZeroOrPositiveException);
    }

    repository.assertPersistCourierHasNotBeenCalled();
  });

  it('should throw exception if courier does not exists', async () => {
    const courier = CapacityTrackCourierMother.random();
    repository.whenGetByIdThenReturn(null);

    expect.assertions(2);

    try {
      await command.run({
        courierId: courier.id.value,
        maxCapacity: courier.maxCapacity.value
      });
    } catch (error) {
      expect(error).toBeInstanceOf(CapacityTrackCourierNotFoundException);
    }

    repository.assertLastGetCourierByIdIs(courier.id);
  });
});
