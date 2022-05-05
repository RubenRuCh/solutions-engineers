import { CapacityTrackCourierMother } from './../../Domain/Model/CapacityTrackCourierMother';
import { InMemoryCapacityTrackCourierRepository } from '../../../../../../src/Contexts/CapacityTrack/Courier/Infraestructure/Repository/InMemoryCapacityTrackCourierRepository';
import { CapacityTrackCourierCapacityMother } from '../../Domain/ValueObject/CapacityTrackCourierCapacityMother';
import { CapacityTrackCourierNotFoundException } from '../../../../../../src/Contexts/CapacityTrack/Courier/Domain/Exception/CapacityTrackCourierNotFoundException';
import { CapacityTrackCourier } from '../../../../../../src/Contexts/CapacityTrack/Courier/Domain/Model/Entities/CapacityTrackCourier';
import { CapacityTrackCourierIdMother } from '../../Domain/ValueObject/CapacityTrackCourierIdMother';
import { buildMockCriteriaForCapacity } from '../../Application/Query/GetCouriersByCapacity/GetCouriersByCapacity.test';

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

  describe('Search', () => {
    beforeEach(async () => {
      repository.clear();
    });

    it('should return an array of couriers that match the criteria', async () => {
      const capacity5 = CapacityTrackCourierCapacityMother.create(5);
      const capacity20 = CapacityTrackCourierCapacityMother.create(20);
      const capacity50 = CapacityTrackCourierCapacityMother.create(50);
      const capacity100 = CapacityTrackCourierCapacityMother.create(100);

      const courier1 = CapacityTrackCourierMother.create(CapacityTrackCourierIdMother.random(), capacity5, capacity5);
      const courier2 = CapacityTrackCourierMother.create(CapacityTrackCourierIdMother.random(), capacity20, capacity20);
      const courier3 = CapacityTrackCourierMother.create(
        CapacityTrackCourierIdMother.random(),
        capacity100,
        capacity100
      );
      const courier4 = CapacityTrackCourierMother.create(CapacityTrackCourierIdMother.random(), capacity50, capacity50);

      await repository.persist(courier1);
      await repository.persist(courier2);
      await repository.persist(courier3);
      await repository.persist(courier4);

      const capacityCriteria = buildMockCriteriaForCapacity(capacity20);

      const couriers = await repository.search(capacityCriteria);

      expect(couriers).toEqual([courier3, courier4, courier2]);
    });
  });
});
