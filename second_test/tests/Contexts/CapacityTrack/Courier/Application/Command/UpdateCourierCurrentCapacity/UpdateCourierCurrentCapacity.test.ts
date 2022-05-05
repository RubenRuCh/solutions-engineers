import { UpdateCourierCurrentCapacity } from '../../../../../../../src/Contexts/CapacityTrack/Courier/Application/Command/UpdateCourierCurrentCapacity/UpdateCourierCurrentCapacity';
import { CapacityTrackCourierDontHaveEnoughCapacityException } from '../../../../../../../src/Contexts/CapacityTrack/Courier/Domain/Exception/CapacityTrackCourierDontHaveEnoughCapacityException';
import { CapacityTrackCourierNotFoundException } from '../../../../../../../src/Contexts/CapacityTrack/Courier/Domain/Exception/CapacityTrackCourierNotFoundException';
import { CapacityTrackCurrentCourierCapacityCannotExceedMaximumCapacityException } from '../../../../../../../src/Contexts/CapacityTrack/Courier/Domain/Exception/CapacityTrackCurrentCourierCapacityCannotExceedMaximumCapacityException';
import { CapacityTrackCourier } from '../../../../../../../src/Contexts/CapacityTrack/Courier/Domain/Model/Entities/CapacityTrackCourier';
import { CapacityTrackPackageVolumeMustBeAboveZeroException } from '../../../../../../../src/Contexts/CapacityTrack/Shared/Domain/Exception/CapacityTrackPackageVolumeMustBeAboveZeroException';
import { CapacityTrackPackageVolumeMother } from '../../../../Shared/Domain/ValueObject/CapacityTrackPackageVolumeMother';
import { CapacityTrackCourierMother } from '../../../Domain/Model/CapacityTrackCourierMother';
import { CapacityTrackCourierCapacityMother } from '../../../Domain/ValueObject/CapacityTrackCourierCapacityMother';
import { CapacityTrackCourierIdMother } from '../../../Domain/ValueObject/CapacityTrackCourierIdMother';
import { CapacityTrackCourierRepositoryMock } from '../../../__mocks/CapacityTrackCourierRepositoryMock';

let repository: CapacityTrackCourierRepositoryMock;
let command: UpdateCourierCurrentCapacity;

describe('UpdateCourierCurrentCapacity', () => {
  beforeEach(() => {
    repository = new CapacityTrackCourierRepositoryMock();
    command = new UpdateCourierCurrentCapacity(repository);
  });

  describe('Doing pickups', () => {
    const operationType = 'pickup';

    it('should reduce the current capacity of an existing courier based on the volume of the package', async () => {
      const courierId = CapacityTrackCourierIdMother.random();
      const maxCapacity = CapacityTrackCourierCapacityMother.create(100);
      const oldCurrentCapacity = CapacityTrackCourierCapacityMother.create(100);
      const packageVolume = CapacityTrackPackageVolumeMother.create(50);

      const courier = CapacityTrackCourierMother.create(courierId, maxCapacity, oldCurrentCapacity);

      repository.whenGetByIdThenReturn(courier);

      const expectedNewCurrentCapacity = CapacityTrackCourierCapacityMother.create(50);

      await command.run({
        courierId: courier.id.value,
        operationType,
        packageVolume: packageVolume.value
      });

      const expectedCourier = CapacityTrackCourier.fromPrimitives({
        id: courier.id.value,
        maxCapacity: courier.maxCapacity.value,
        currentCapacity: expectedNewCurrentCapacity.value
      });

      repository.assertLastPersistedCourierIs(expectedCourier);
    });

    it('should take all the current capacity of an existing courier if volume of the package match the total available', async () => {
      const courierId = CapacityTrackCourierIdMother.random();
      const maxCapacity = CapacityTrackCourierCapacityMother.create(100);
      const oldCurrentCapacity = CapacityTrackCourierCapacityMother.create(75);
      const packageVolume = CapacityTrackPackageVolumeMother.create(75);

      const courier = CapacityTrackCourierMother.create(courierId, maxCapacity, oldCurrentCapacity);

      repository.whenGetByIdThenReturn(courier);

      const expectedNewCurrentCapacity = CapacityTrackCourierCapacityMother.create(0);

      await command.run({
        courierId: courier.id.value,
        operationType,
        packageVolume: packageVolume.value
      });

      const expectedCourier = CapacityTrackCourier.fromPrimitives({
        id: courier.id.value,
        maxCapacity: courier.maxCapacity.value,
        currentCapacity: expectedNewCurrentCapacity.value
      });

      repository.assertLastPersistedCourierIs(expectedCourier);
    });

    it('should take the max capacity of an existing courier if volume of the package match the max capacity and courier is empty', async () => {
      const courierId = CapacityTrackCourierIdMother.random();
      const maxCapacity = CapacityTrackCourierCapacityMother.create(100);
      const oldCurrentCapacity = CapacityTrackCourierCapacityMother.create(100);
      const packageVolume = CapacityTrackPackageVolumeMother.create(100);

      const courier = CapacityTrackCourierMother.create(courierId, maxCapacity, oldCurrentCapacity);

      repository.whenGetByIdThenReturn(courier);

      const expectedNewCurrentCapacity = CapacityTrackCourierCapacityMother.create(0);

      await command.run({
        courierId: courier.id.value,
        operationType,
        packageVolume: packageVolume.value
      });

      const expectedCourier = CapacityTrackCourier.fromPrimitives({
        id: courier.id.value,
        maxCapacity: courier.maxCapacity.value,
        currentCapacity: expectedNewCurrentCapacity.value
      });

      repository.assertLastPersistedCourierIs(expectedCourier);
    });

    it("should throw exception when trying to pick a package that exceed current courier capacity even if it does't reach max capacity", async () => {
      const courierId = CapacityTrackCourierIdMother.random();
      const maxCapacity = CapacityTrackCourierCapacityMother.create(200);
      const oldCurrentCapacity = CapacityTrackCourierCapacityMother.create(10);
      const packageVolume = CapacityTrackPackageVolumeMother.create(100);

      const courier = CapacityTrackCourierMother.create(courierId, maxCapacity, oldCurrentCapacity);

      repository.whenGetByIdThenReturn(courier);

      expect.assertions(2);

      try {
        await command.run({
          courierId: courier.id.value,
          operationType,
          packageVolume: packageVolume.value
        });
      } catch (error) {
        expect(error).toBeInstanceOf(CapacityTrackCourierDontHaveEnoughCapacityException);
      }

      repository.assertPersistCourierHasNotBeenCalled();
    });

    it('should throw exception when trying to pick a package that exceed max capacity of a courier even when courier is not delivering anything', async () => {
      const courierId = CapacityTrackCourierIdMother.random();
      const maxCapacity = CapacityTrackCourierCapacityMother.create(100);
      const oldCurrentCapacity = CapacityTrackCourierCapacityMother.create(100);
      const packageVolume = CapacityTrackPackageVolumeMother.create(200);

      const courier = CapacityTrackCourierMother.create(courierId, maxCapacity, oldCurrentCapacity);

      repository.whenGetByIdThenReturn(courier);

      expect.assertions(2);

      try {
        await command.run({
          courierId: courier.id.value,
          operationType,
          packageVolume: packageVolume.value
        });
      } catch (error) {
        expect(error).toBeInstanceOf(CapacityTrackCourierDontHaveEnoughCapacityException);
      }

      repository.assertPersistCourierHasNotBeenCalled();
    });

    it('should throw exception when trying to pick a package whose volume is negative', async () => {
      const courier = CapacityTrackCourierMother.random();
      const invalidPackageVolumeValue = -10;

      repository.whenGetByIdThenReturn(courier);

      expect.assertions(2);

      try {
        await command.run({
          courierId: courier.id.value,
          operationType,
          packageVolume: invalidPackageVolumeValue
        });
      } catch (error) {
        expect(error).toBeInstanceOf(CapacityTrackPackageVolumeMustBeAboveZeroException);
      }

      repository.assertPersistCourierHasNotBeenCalled();
    });

    it('should throw exception when trying to pickup with an unexisting courier', async () => {
      const courier = CapacityTrackCourierMother.random();
      const packageVolume = CapacityTrackPackageVolumeMother.create(200);

      repository.whenGetByIdThenReturn(null);

      expect.assertions(2);

      try {
        await command.run({
          courierId: courier.id.value,
          operationType,
          packageVolume: packageVolume.value
        });
      } catch (error) {
        expect(error).toBeInstanceOf(CapacityTrackCourierNotFoundException);
      }

      repository.assertPersistCourierHasNotBeenCalled();
    });
  });

  describe('Doing deliveries', () => {
    const operationType = 'delivery';

    it('should increment the current capacity of an existing courier based on the volume of the package', async () => {
      const courierId = CapacityTrackCourierIdMother.random();
      const maxCapacity = CapacityTrackCourierCapacityMother.create(100);
      const oldCurrentCapacity = CapacityTrackCourierCapacityMother.create(10);
      const packageVolume = CapacityTrackPackageVolumeMother.create(50);

      const courier = CapacityTrackCourierMother.create(courierId, maxCapacity, oldCurrentCapacity);

      repository.whenGetByIdThenReturn(courier);

      const expectedNewCurrentCapacity = CapacityTrackCourierCapacityMother.create(60);

      await command.run({
        courierId: courier.id.value,
        operationType,
        packageVolume: packageVolume.value
      });

      const expectedCourier = CapacityTrackCourier.fromPrimitives({
        id: courier.id.value,
        maxCapacity: courier.maxCapacity.value,
        currentCapacity: expectedNewCurrentCapacity.value
      });

      repository.assertLastPersistedCourierIs(expectedCourier);
    });

    it('should fill all the current capacity of an existing courier if volume of the package match the max capacity and there was no available', async () => {
      const courierId = CapacityTrackCourierIdMother.random();
      const maxCapacity = CapacityTrackCourierCapacityMother.create(100);
      const oldCurrentCapacity = CapacityTrackCourierCapacityMother.create(0);
      const packageVolume = CapacityTrackPackageVolumeMother.create(100);

      const courier = CapacityTrackCourierMother.create(courierId, maxCapacity, oldCurrentCapacity);

      repository.whenGetByIdThenReturn(courier);

      const expectedNewCurrentCapacity = CapacityTrackCourierCapacityMother.create(100);

      await command.run({
        courierId: courier.id.value,
        operationType,
        packageVolume: packageVolume.value
      });

      const expectedCourier = CapacityTrackCourier.fromPrimitives({
        id: courier.id.value,
        maxCapacity: courier.maxCapacity.value,
        currentCapacity: expectedNewCurrentCapacity.value
      });

      repository.assertLastPersistedCourierIs(expectedCourier);
    });

    // TODO Check if this test is still valid
    it('should throw exception when trying to deliver a package whose volume increment current capacity over max capacity', async () => {
      const courierId = CapacityTrackCourierIdMother.random();
      const maxCapacity = CapacityTrackCourierCapacityMother.create(100);
      const oldCurrentCapacity = CapacityTrackCourierCapacityMother.create(90);
      const packageVolume = CapacityTrackPackageVolumeMother.create(20);

      const courier = CapacityTrackCourierMother.create(courierId, maxCapacity, oldCurrentCapacity);

      repository.whenGetByIdThenReturn(courier);

      expect.assertions(2);

      try {
        await command.run({
          courierId: courier.id.value,
          operationType,
          packageVolume: packageVolume.value
        });
      } catch (error) {
        expect(error).toBeInstanceOf(CapacityTrackCurrentCourierCapacityCannotExceedMaximumCapacityException);
      }

      repository.assertPersistCourierHasNotBeenCalled();
    });

    // TODO Check if this test is still valid
    it('should throw exception when trying to deliver a package that exceed max capacity', async () => {
      const courierId = CapacityTrackCourierIdMother.random();
      const maxCapacity = CapacityTrackCourierCapacityMother.create(100);
      const oldCurrentCapacity = CapacityTrackCourierCapacityMother.create(0);
      const packageVolume = CapacityTrackPackageVolumeMother.create(200);

      const courier = CapacityTrackCourierMother.create(courierId, maxCapacity, oldCurrentCapacity);

      repository.whenGetByIdThenReturn(courier);

      expect.assertions(2);

      try {
        await command.run({
          courierId: courier.id.value,
          operationType,
          packageVolume: packageVolume.value
        });
      } catch (error) {
        expect(error).toBeInstanceOf(CapacityTrackCurrentCourierCapacityCannotExceedMaximumCapacityException);
      }

      repository.assertPersistCourierHasNotBeenCalled();
    });

    it('should throw exception when trying to deliver a package whose volume is negative', async () => {
      const courier = CapacityTrackCourierMother.random();
      const invalidPackageVolumeValue = -10;

      repository.whenGetByIdThenReturn(courier);

      expect.assertions(2);

      try {
        await command.run({
          courierId: courier.id.value,
          operationType,
          packageVolume: invalidPackageVolumeValue
        });
      } catch (error) {
        expect(error).toBeInstanceOf(CapacityTrackPackageVolumeMustBeAboveZeroException);
      }

      repository.assertPersistCourierHasNotBeenCalled();
    });

    it('should throw exception when trying to deliver a package with an unexisting courier', async () => {
      const courier = CapacityTrackCourierMother.random();
      const packageVolume = CapacityTrackPackageVolumeMother.create(200);

      repository.whenGetByIdThenReturn(null);

      expect.assertions(2);

      try {
        await command.run({
          courierId: courier.id.value,
          operationType,
          packageVolume: packageVolume.value
        });
      } catch (error) {
        expect(error).toBeInstanceOf(CapacityTrackCourierNotFoundException);
      }

      repository.assertPersistCourierHasNotBeenCalled();
    });
  });
});
