import httpStatus from 'http-status';
import request from 'supertest';
import { MongoCapacityTrackCourierRepository } from '../../../../../src/Contexts/CapacityTrack/Courier/Infraestructure/Repository/MongoCapacityTrackCourierRepository';
import { MongoConfigFactory } from '../../../../../src/Contexts/CapacityTrack/Shared/Infraestructure/Repository/Mongo/MongoConfigFactory';
import { MongoClientFactory } from '../../../../../src/Contexts/Shared/Infraestructure/Repository/Mongo/MongoClientFactory';
import { CapacityTrackCourierMother } from '../../../../Contexts/CapacityTrack/Courier/Domain/Model/CapacityTrackCourierMother';
import app from '../app';

const client = MongoClientFactory.createClient('e2e-test-post-controller', MongoConfigFactory.createConfig());
const repository = new MongoCapacityTrackCourierRepository(client);

describe('PostCourierController', () => {
  beforeEach(async () => {
    await repository.clear();
  });

  afterAll(async () => {
    await repository.clear();
    await (await client).close();
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
