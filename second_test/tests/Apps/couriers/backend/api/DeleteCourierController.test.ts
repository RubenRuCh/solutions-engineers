import httpStatus from 'http-status';
import request from 'supertest';
import { InMemoryCapacityTrackCourierRepository } from '../../../../../src/Contexts/CapacityTrack/Courier/Infraestructure/Repository/InMemoryCapacityTrackCourierRepository';
import { CapacityTrackCourierMother } from '../../../../Contexts/CapacityTrack/Courier/Domain/Model/CapacityTrackCourierMother';
import app from '../app';

const repository = new InMemoryCapacityTrackCourierRepository();

describe('DeleteCourierController', () => {
  beforeEach(async () => {
    await repository.clear();
  });

  afterAll(async () => {
    await repository.clear();
    app?.close();
  });

  it('should return 200 if delete courier process is successful', async () => {
    const courier = CapacityTrackCourierMother.random();
    await repository.persist(courier);

    await request(app)
      .delete(`/couriers/${courier.id.value}`)
      .send()
      .expect(res => {
        expect(res.status).toEqual(httpStatus.NO_CONTENT);
        expect(res.body).toEqual({});
      });

    expect(await repository.getById(courier.id)).toBeNull();
  });

  it('should return 400 if trying to delete and unexisting courier', async () => {
    const courier = CapacityTrackCourierMother.random();
    await repository.clear();

    await request(app)
      .delete(`/couriers/${courier.id.value}`)
      .send()
      .expect(res => {
        expect(res.status).toEqual(httpStatus.NOT_FOUND);
        expect(res.body.errorType).toBe('CapacityTrackCourierNotFoundException');
      });
  });
});
