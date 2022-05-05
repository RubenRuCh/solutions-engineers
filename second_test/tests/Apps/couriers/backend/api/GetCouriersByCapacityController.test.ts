import httpStatus from 'http-status';
import request from 'supertest';
import { MongoCapacityTrackCourierRepository } from '../../../../../src/Contexts/CapacityTrack/Courier/Infraestructure/Repository/MongoCapacityTrackCourierRepository';
import { MongoConfigFactory } from '../../../../../src/Contexts/CapacityTrack/Shared/Infraestructure/Repository/Mongo/MongoConfigFactory';
import { MongoClientFactory } from '../../../../../src/Contexts/Shared/Infraestructure/Repository/Mongo/MongoClientFactory';
import { CapacityTrackCourierMother } from '../../../../Contexts/CapacityTrack/Courier/Domain/Model/CapacityTrackCourierMother';
import { CapacityTrackCourierCapacityMother } from '../../../../Contexts/CapacityTrack/Courier/Domain/ValueObject/CapacityTrackCourierCapacityMother';
import { CapacityTrackCourierIdMother } from '../../../../Contexts/CapacityTrack/Courier/Domain/ValueObject/CapacityTrackCourierIdMother';
import app from '../app';

const client = MongoClientFactory.createClient(
  'e2e-test-get-by-capacity-controller',
  MongoConfigFactory.createConfig()
);
const repository = new MongoCapacityTrackCourierRepository(client);

describe('GetCouriersByCapacityController', () => {
  beforeEach(async () => {
    await repository.clear();
  });

  afterAll(async () => {
    await repository.clear();
    await (await client).close();
    app?.close();
  });

  it('should return 200 with empty array if there is no couriers', async () => {
    await request(app)
      .get('/couriers/lookup')
      .send({
        capacity_required: 10
      })
      .expect(res => {
        expect(res.status).toEqual(httpStatus.OK);
        expect(res.body).toEqual([]);
      });
  });

  it('should return all couriers that match the required capacity, order by currentCapacity desc', async () => {
    const capacity5 = CapacityTrackCourierCapacityMother.create(5);
    const capacity20 = CapacityTrackCourierCapacityMother.create(20);
    const capacity50 = CapacityTrackCourierCapacityMother.create(50);
    const capacity100 = CapacityTrackCourierCapacityMother.create(100);

    const courier1 = CapacityTrackCourierMother.create(CapacityTrackCourierIdMother.random(), capacity5, capacity5);
    const courier2 = CapacityTrackCourierMother.create(CapacityTrackCourierIdMother.random(), capacity20, capacity20);
    const courier3 = CapacityTrackCourierMother.create(CapacityTrackCourierIdMother.random(), capacity100, capacity100);
    const courier4 = CapacityTrackCourierMother.create(CapacityTrackCourierIdMother.random(), capacity50, capacity50);

    await repository.persist(courier1);
    await repository.persist(courier2);
    await repository.persist(courier3);
    await repository.persist(courier4);

    await request(app)
      .get('/couriers/lookup')
      .send({
        capacity_required: 20
      })
      .expect(res => {
        expect(res.status).toEqual(httpStatus.OK);
        expect(res.body).toEqual([courier3.toPrimitives(), courier4.toPrimitives(), courier2.toPrimitives()]);
      });
  });

  it('should return 400 if client dont send the correct parameter', async () => {
    await request(app)
      .get('/couriers/lookup')
      .send({
        capacity: 10
      })
      .expect(res => {
        expect(res.status).toEqual(httpStatus.BAD_REQUEST);
      });
  });
});
