import httpStatus from 'http-status';
import request from 'supertest';
import { InMemoryCapacityTrackCourierRepository } from '../../../../../src/Contexts/CapacityTrack/Courier/Infraestructure/Repository/InMemoryCapacityTrackCourierRepository';
import { CapacityTrackCourierMother } from '../../../../Contexts/CapacityTrack/Courier/Domain/Model/CapacityTrackCourierMother';
import app from '../app';

const repository = new InMemoryCapacityTrackCourierRepository();

describe('PutCourierController', () => {
  beforeEach(async () => {
    await repository.clear();
  });

  afterAll(async () => {
    await repository.clear();
    app?.close();
  });

  it('should return 200 if update courier max capacity process is successful', async () => {
    const courier = CapacityTrackCourierMother.random();
    await repository.persist(courier);

    const newMaxCapacity = courier.maxCapacity.value + 1;

    await request(app)
      .put(`/couriers/${courier.id.value}`)
      .send({
        max_capacity: newMaxCapacity
      })
      .expect(res => {
        expect(res.status).toEqual(httpStatus.OK);
        expect(res.body).toEqual({
          id: courier.id.value,
          maxCapacity: newMaxCapacity,
          currentCapacity: newMaxCapacity
        });
      });
  });

  it('should return 400 if trying to put max capacity under 0', async () => {
    const courier = CapacityTrackCourierMother.random();
    await repository.persist(courier);

    await request(app)
      .put(`/couriers/${courier.id.value}`)
      .send({
        max_capacity: -10
      })
      .expect(res => {
        expect(res.status).toEqual(httpStatus.BAD_REQUEST);
        expect(res.body.errorType).toBe('CapacityTrackCourierCapacityMustBeZeroOrPositiveException');
      });
  });
});
