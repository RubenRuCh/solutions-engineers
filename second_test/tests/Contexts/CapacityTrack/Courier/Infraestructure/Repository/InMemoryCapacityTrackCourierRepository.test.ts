import { CapacityTrackCourierMother } from './../../Domain/Model/CapacityTrackCourierMother';
import { InMemoryCapacityTrackCourierRepository } from '../../../../../../src/Contexts/CapacityTrack/Courier/Infraestructure/Repository/InMemoryCapacityTrackCourierRepository';
import { CapacityTrackCourierCapacityMother } from '../../Domain/ValueObject/CapacityTrackCourierCapacityMother';
import { CapacityTrackCourierNotFoundException } from '../../../../../../src/Contexts/CapacityTrack/Courier/Domain/Exception/CapacityTrackCourierNotFoundException';
import { CapacityTrackCourier } from '../../../../../../src/Contexts/CapacityTrack/Courier/Domain/Model/Entities/CapacityTrackCourier';

const repository = new InMemoryCapacityTrackCourierRepository();

describe('InMemoryCapacityTrackCourierRepository', () => {
  beforeEach(async () => {
    await repository.clear();
  });

  describe('Persist', () => {
    beforeEach(async () => {
      await repository.clear();
    });

    it('should save a new courier', async () => {
      const newCourier = CapacityTrackCourierMother.random();

      await repository.persist(newCourier);
      const savedCourier = (await repository.getById(newCourier.id)) as CapacityTrackCourier;

      expect(savedCourier).toEqual(newCourier);
    });

    it('should update an existing courier', async () => {
      const oldCourier = CapacityTrackCourierMother.random();
      await repository.persist(oldCourier);

      const savedCourier = (await repository.getById(oldCourier.id)) as CapacityTrackCourier;
      const newMaxCapacity = CapacityTrackCourierCapacityMother.create(oldCourier.maxCapacity.value + 1);
      savedCourier.update({ newMaxCapacity });
      await repository.persist(savedCourier);

      const updatedCourier = (await repository.getById(oldCourier.id)) as CapacityTrackCourier;

      expect(updatedCourier).toEqual(savedCourier);
      expect(updatedCourier).not.toEqual(oldCourier);
    });
  });

  describe('Delete', () => {
    beforeEach(async () => {
      await repository.clear();
    });

    it('should delete a persisted courier', async () => {
      const oldCourier = CapacityTrackCourierMother.random();
      await repository.persist(oldCourier);

      await repository.delete(oldCourier.id);

      const deletedCourier = await repository.getById(oldCourier.id);

      expect(deletedCourier).toBeNull();
    });

    it('should throw excepcion when trying to delete a non-existing courier', async () => {
      const unexistingCourier = CapacityTrackCourierMother.random();

      expect.assertions(1);

      try {
        await repository.delete(unexistingCourier.id);
      } catch (error) {
        expect(error).toBeInstanceOf(CapacityTrackCourierNotFoundException);
      }
    });
  });

  describe('GetById', () => {
    beforeEach(async () => {
      await repository.clear();
    });

    it('should return the courier that its identified by the id', async () => {
      const savedCourier = CapacityTrackCourierMother.random();
      await repository.persist(savedCourier);

      const searchedCourier = (await repository.getById(savedCourier.id)) as CapacityTrackCourier;

      expect(searchedCourier).toEqual(savedCourier);
    });

    it("should return null if there's no courier that its identified by the id", async () => {
      const savedCourier = CapacityTrackCourierMother.random();
      await repository.persist(savedCourier);

      const unsavedCourier = CapacityTrackCourierMother.random();
      const searchedCourier = await repository.getById(unsavedCourier.id);

      expect(searchedCourier).toBeNull();
    });

    it("should return null if there's no courier saved", async () => {
      const unsavedCourier = CapacityTrackCourierMother.random();
      const searchedCourier = await repository.getById(unsavedCourier.id);

      expect(searchedCourier).toBeNull();
    });
  });
});
