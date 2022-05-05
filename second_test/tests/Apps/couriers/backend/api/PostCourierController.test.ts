import httpStatus from 'http-status';
import request from 'supertest';
import { InMemoryCapacityTrackCourierRepository } from '../../../../../src/Contexts/CapacityTrack/Courier/Infraestructure/Repository/InMemoryCapacityTrackCourierRepository';
import { CapacityTrackCourierMother } from '../../../../Contexts/CapacityTrack/Courier/Domain/Model/CapacityTrackCourierMother';
import app from '../app';

const repository = new InMemoryCapacityTrackCourierRepository();

describe('PostCourierController', () => {
  beforeEach(async () => {
    await repository.clear();
  });

  afterAll(async () => {
    await repository.clear();
    app?.close();
  });

  it('should return 200 if create courier process is successful', async () => {
    const courier = CapacityTrackCourierMother.random();

    await request(app)
      .post('/couriers')
      .send({
        id: courier.id.value,
        max_capacity: courier.maxCapacity.value
      })
      .expect(res => {
        expect(res.status).toEqual(httpStatus.CREATED);
        expect(res.body).toEqual({
          id: courier.id.value,
          maxCapacity: courier.maxCapacity.value,
          currentCapacity: courier.maxCapacity.value
        });
      });

    expect(await repository.getById(courier.id)).toEqual(courier);
  });

  it('should return 400 if client dont send correct parameters', async () => {
    const courier = CapacityTrackCourierMother.random();

    await request(app)
      .post('/couriers')
      .send({
        id: courier.id.value,
        capacity: courier.maxCapacity.value
      })
      .expect(res => {
        expect(res.status).toEqual(httpStatus.BAD_REQUEST);
      });
  });
});
