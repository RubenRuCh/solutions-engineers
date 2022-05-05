import { Criteria } from '../../../../../Shared/Domain/Criteria/Criteria';
import { Filter } from '../../../../../Shared/Domain/Criteria/Filter';
import { FilterField } from '../../../../../Shared/Domain/Criteria/FilterField';
import { FilterOperator, Operator } from '../../../../../Shared/Domain/Criteria/FilterOperator';
import { Filters } from '../../../../../Shared/Domain/Criteria/Filters';
import { FilterValue } from '../../../../../Shared/Domain/Criteria/FilterValue';
import { Order } from '../../../../../Shared/Domain/Criteria/Order';
import { OrderBy } from '../../../../../Shared/Domain/Criteria/OrderBy';
import { OrderType } from '../../../../../Shared/Domain/Criteria/OrderType';
import { CapacityTrackCourierDTO } from '../../../Domain/Model/DTOs/CapacityTrackCourierDTO';
import { CapacityTrackCourierRepository } from '../../../Domain/Model/Interfaces/Repository/CapacityTrackCourierRepository';
import { CapacityTrackCourierCapacity } from '../../../Domain/ValueObject/CapacityTrackCourierCapacity';

export class GetCouriersByCapacity {
  constructor(private repository: CapacityTrackCourierRepository) {}

  async run({ capacityRequired }: { capacityRequired: number }): Promise<CapacityTrackCourierDTO[]> {
    const domainCapacityRequired = new CapacityTrackCourierCapacity(capacityRequired);
    const couriers = await this.repository.search(this.buildCriteriaForCapacity(domainCapacityRequired));

    return couriers.map(courier => courier.toPrimitives());
  }

  private buildCriteriaForCapacity(desiredCapacity: CapacityTrackCourierCapacity): Criteria {
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
}
