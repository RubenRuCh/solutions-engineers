import httpStatus from 'http-status';
import request from 'supertest';
import { MongoCapacityTrackCourierRepository } from '../../../../../src/Contexts/CapacityTrack/Courier/Infraestructure/Repository/MongoCapacityTrackCourierRepository';
import { MongoConfigFactory } from '../../../../../src/Contexts/CapacityTrack/Shared/Infraestructure/Repository/Mongo/MongoConfigFactory';
import { MongoClientFactory } from '../../../../../src/Contexts/Shared/Infraestructure/Repository/Mongo/MongoClientFactory';
import { CapacityTrackCourierMother } from '../../../../Contexts/CapacityTrack/Courier/Domain/Model/CapacityTrackCourierMother';
import { CapacityTrackCourierCapacityMother } from '../../../../Contexts/CapacityTrack/Courier/Domain/ValueObject/CapacityTrackCourierCapacityMother';
import { CapacityTrackPackageVolumeMother } from '../../../../Contexts/CapacityTrack/Shared/Domain/ValueObject/CapacityTrackPackageVolumeMother';
import app from '../app';

const client = MongoClientFactory.createClient('e2e-test-patch-controller', MongoConfigFactory.createConfig());
const repository = new MongoCapacityTrackCourierRepository(client);

describe('PatchCourierController', () => {
  beforeEach(async () => {
    await repository.clear();
  });

  afterAll(async () => {
    await repository.clear();
    await (await client).close();
    app?.close();
  });

  it('should return 200 if update current capacity by a pickup process is successful', async () => {
    const courier = CapacityTrackCourierMother.random();
    await repository.persist(courier);

    const packageVolume = CapacityTrackPackageVolumeMother.create(courier.currentCapacity.value);

    await request(app)
      .patch(`/couriers/${courier.id.value}`)
      .send({
        operationType: 'pickup',
        packageVolume: packageVolume.value
      })
      .expect(res => {
        expect(res.status).toEqual(httpStatus.OK);
        expect(res.body).toEqual({
          id: courier.id.value,
          maxCapacity: courier.maxCapacity.value,
          currentCapacity: 0
        });
      });
  });

  it('should return 200 if update current capacity by a delivery process is successful', async () => {
    const courier = CapacityTrackCourierMother.withCapacity(
      CapacityTrackCourierCapacityMother.random(),
      CapacityTrackCourierCapacityMother.create(0)
    );

    await repository.persist(courier);

    const packageVolume = CapacityTrackPackageVolumeMother.create(courier.maxCapacity.value);

    await request(app)
      .patch(`/couriers/${courier.id.value}`)
      .send({
        operationType: 'delivery',
        packageVolume: packageVolume.value
      })
      .expect(res => {
        expect(res.status).toEqual(httpStatus.OK);
        expect(res.body).toEqual({
          id: courier.id.value,
          maxCapacity: courier.maxCapacity.value,
          currentCapacity: packageVolume.value
        });
      });
  });

  it('should return 400 if send an non-supported operation type', async () => {
    const courier = CapacityTrackCourierMother.withCapacity(
      CapacityTrackCourierCapacityMother.random(),
      CapacityTrackCourierCapacityMother.create(0)
    );

    await repository.persist(courier);

    const packageVolume = CapacityTrackPackageVolumeMother.create(courier.maxCapacity.value);

    await request(app)
      .patch(`/couriers/${courier.id.value}`)
      .send({
        operationType: 'random-operation',
        packageVolume: packageVolume.value
      })
      .expect(res => {
        expect(res.status).toEqual(httpStatus.BAD_REQUEST);
      });
  });
});
