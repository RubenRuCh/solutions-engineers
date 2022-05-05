import { GetCouriersByCapacity } from '../../../../../../../src/Contexts/CapacityTrack/Courier/Application/Query/GetCouriersByCapacity/GetCouriersByCapacity';
import { CapacityTrackCourierCapacity } from '../../../../../../../src/Contexts/CapacityTrack/Courier/Domain/ValueObject/CapacityTrackCourierCapacity';
import { Criteria } from '../../../../../../../src/Contexts/Shared/Domain/Criteria/Criteria';
import { Filter } from '../../../../../../../src/Contexts/Shared/Domain/Criteria/Filter';
import { FilterField } from '../../../../../../../src/Contexts/Shared/Domain/Criteria/FilterField';
import { FilterOperator, Operator } from '../../../../../../../src/Contexts/Shared/Domain/Criteria/FilterOperator';
import { Filters } from '../../../../../../../src/Contexts/Shared/Domain/Criteria/Filters';
import { FilterValue } from '../../../../../../../src/Contexts/Shared/Domain/Criteria/FilterValue';
import { Order } from '../../../../../../../src/Contexts/Shared/Domain/Criteria/Order';
import { OrderBy } from '../../../../../../../src/Contexts/Shared/Domain/Criteria/OrderBy';
import { OrderType } from '../../../../../../../src/Contexts/Shared/Domain/Criteria/OrderType';
import { CapacityTrackCourierMother } from '../../../Domain/Model/CapacityTrackCourierMother';
import { CapacityTrackCourierCapacityMother } from '../../../Domain/ValueObject/CapacityTrackCourierCapacityMother';
import { CapacityTrackCourierRepositoryMock } from '../../../__mocks/CapacityTrackCourierRepositoryMock';

let repository: CapacityTrackCourierRepositoryMock;
let query: GetCouriersByCapacity;

describe('GetCouriersByCapacity', () => {
  beforeEach(() => {
    repository = new CapacityTrackCourierRepositoryMock();
    query = new GetCouriersByCapacity(repository);
  });

  it('should return empty array if there is no couriers', async () => {
    const courierCapacity = CapacityTrackCourierCapacityMother.random();
    repository.whenSearchThenReturn([]);

    const response = await query.run({ capacityRequired: courierCapacity.value });

    repository.assertLastSearchIs(buildMockCriteriaForCapacity(courierCapacity));
    expect(response).toEqual([]);
  });

  it('should return array with the couriers that matches required capacity', async () => {
    const courierCapacity = CapacityTrackCourierCapacityMother.random();

    const courier1 = CapacityTrackCourierMother.random();
    repository.whenSearchThenReturn([courier1]);

    const response = await query.run({ capacityRequired: courierCapacity.value });

    repository.assertLastSearchIs(buildMockCriteriaForCapacity(courierCapacity));
    expect(response).toEqual([courier1.toPrimitives()]);
  });

});

export function buildMockCriteriaForCapacity(desiredCapacity: CapacityTrackCourierCapacity): Criteria {
  const filterCapacityField = new FilterField('currentCapacity');
  const filterCapacityOperator = new FilterOperator(Operator.GTE);
  const filterCapacityValue = new FilterValue(desiredCapacity.value.toString());
  const filterCapacity = new Filter(filterCapacityField, filterCapacityOperator, filterCapacityValue);
  const filters = new Filters([filterCapacity]);

  const orderBy = new OrderBy('currentCapacity');
  const orderType = OrderType.fromValue('desc');
  const order = new Order(orderBy, orderType);

  const criteria = new Criteria(filters, order);

  return criteria;
}
