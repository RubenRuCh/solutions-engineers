import httpStatus from 'http-status';
import request from 'supertest';
import { MongoCapacityTrackCourierRepository } from '../../../../../src/Contexts/CapacityTrack/Courier/Infraestructure/Repository/MongoCapacityTrackCourierRepository';
import { MongoConfigFactory } from '../../../../../src/Contexts/CapacityTrack/Shared/Infraestructure/Repository/Mongo/MongoConfigFactory';
import { MongoClientFactory } from '../../../../../src/Contexts/Shared/Infraestructure/Repository/Mongo/MongoClientFactory';
import { CapacityTrackCourierMother } from '../../../../Contexts/CapacityTrack/Courier/Domain/Model/CapacityTrackCourierMother';
import app from '../app';

const client = MongoClientFactory.createClient('e2e-test-delete-controller', MongoConfigFactory.createConfig());
const repository = new MongoCapacityTrackCourierRepository(client);

describe('DeleteCourierController', () => {
  beforeEach(async () => {
    await repository.clear();
  });

  afterAll(async () => {
    await repository.clear();
    await (await client).close();
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
