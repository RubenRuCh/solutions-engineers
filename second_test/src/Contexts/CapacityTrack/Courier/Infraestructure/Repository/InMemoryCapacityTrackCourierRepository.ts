import { Criteria } from '../../../../Shared/Domain/Criteria/Criteria';
import { Operator } from '../../../../Shared/Domain/Criteria/FilterOperator';
import { Nullable } from '../../../../Shared/Domain/Nullable';
import { CapacityTrackCourierNotFoundException } from '../../Domain/Exception/CapacityTrackCourierNotFoundException';
import { CapacityTrackCourierDTO } from '../../Domain/Model/DTOs/CapacityTrackCourierDTO';
import { CapacityTrackCourier } from '../../Domain/Model/Entities/CapacityTrackCourier';
import { CapacityTrackCourierRepository } from '../../Domain/Model/Interfaces/Repository/CapacityTrackCourierRepository';
import { CapacityTrackCourierCapacity } from '../../Domain/ValueObject/CapacityTrackCourierCapacity';
import { CapacityTrackCourierId } from '../../Domain/ValueObject/CapacityTrackCourierId';

export class InMemoryCapacityTrackCourierRepository implements CapacityTrackCourierRepository {
  private static couriers: CapacityTrackCourier[] = [];

  public async persist(courierToSave: CapacityTrackCourier): Promise<void> {
    const searchedCourier = await this.getById(courierToSave.id);

    if (!searchedCourier) {
      InMemoryCapacityTrackCourierRepository.couriers.push(courierToSave);
      return;
    }

    const currentCouriers = [...InMemoryCapacityTrackCourierRepository.couriers];
    const index = currentCouriers.findIndex(courier => courier.id.isEqual(courierToSave.id));
    currentCouriers[index] = courierToSave;

    InMemoryCapacityTrackCourierRepository.couriers = currentCouriers;
  }

  public async delete(courierId: CapacityTrackCourierId): Promise<void> {
    const searchedCourier = await this.getById(courierId);

    if (!searchedCourier) {
      throw new CapacityTrackCourierNotFoundException(courierId.value);
    }

    const currentCouriers = [...InMemoryCapacityTrackCourierRepository.couriers];
    const index = currentCouriers.findIndex(courier => courier.id.isEqual(courierId));

    currentCouriers.splice(index, 1);
    InMemoryCapacityTrackCourierRepository.couriers = currentCouriers;
  }

  public async getById(courierId: CapacityTrackCourierId): Promise<Nullable<CapacityTrackCourier>> {
    const courier = InMemoryCapacityTrackCourierRepository.couriers.find(storedCourier =>
      storedCourier.id.isEqual(courierId)
    );

    if (!courier) {
      return null;
    }

    const clonedCourier = new CapacityTrackCourier(courier.id, courier.maxCapacity, courier.currentCapacity);

    return clonedCourier;
  }

  public async search(criteria: Criteria): Promise<CapacityTrackCourier[]> {
    return InMemoryCapacityTrackCourierRepository.couriers
      .filter(courier => this.matchesCriteria(courier, criteria))
      .sort((courierA, courierB) => this.sortByCriteria(courierA, courierB, criteria));
  }

  private matchesCriteria(courier: CapacityTrackCourier, criteria: Criteria): boolean {
    const filterCurrentCapacity = criteria.filters.filters.find(filter => filter.field.value === 'currentCapacity');

    return matchesCurrentCapacity();

    function matchesCurrentCapacity() {
      if (filterCurrentCapacity) {
        const capacity = +filterCurrentCapacity.value.toString();

        return operatorToCapacityTrackCourierCapacity(
          filterCurrentCapacity.operator.value,
          new CapacityTrackCourierCapacity(capacity)
        );
      }

      return true;
    }

    function operatorToCapacityTrackCourierCapacity(
      operator: Operator,
      capacity: CapacityTrackCourierCapacity
    ): boolean {
      switch (operator) {
        case Operator.EQUAL:
          return courier.currentCapacity.isEqual(capacity);
        case Operator.GT:
          return courier.currentCapacity.isBiggerThan(capacity);
        case Operator.GTE:
          return courier.currentCapacity.isEqual(capacity) || courier.currentCapacity.isBiggerThan(capacity);
        case Operator.LT:
          return courier.currentCapacity.isSmallerThan(capacity);
        case Operator.LTE:
          return courier.currentCapacity.isEqual(capacity) || courier.currentCapacity.isSmallerThan(capacity);
        default:
          return false;
      }
    }
  }

  private sortByCriteria(
    firstCourier: CapacityTrackCourier,
    secondCourier: CapacityTrackCourier,
    criteria: Criteria
  ): number {
    const orderBy = criteria.order.orderBy;
    const orderType = criteria.order.orderType;

    const firstCourierDTO = firstCourier.toPrimitives();
    const secondCourierDTO = secondCourier.toPrimitives();

    const propertyKey = orderBy.value;

    if (!isPropertyOfCourier(propertyKey)) {
      return 0;
    }

    const firstCourierPropertyValue = firstCourierDTO[propertyKey];
    const secondCourierPropertyValue = secondCourierDTO[propertyKey];

    if (!isNumber(firstCourierPropertyValue) || !isNumber(secondCourierPropertyValue)) {
      return 0;
    }

    if (orderType.isAsc()) {
      return firstCourierPropertyValue - secondCourierPropertyValue;
    }

    return secondCourierPropertyValue - firstCourierPropertyValue;

    function isPropertyOfCourier(orderByValue: any): orderByValue is keyof CapacityTrackCourierDTO {
      return orderByValue === 'id' || orderByValue === 'maxCapacity' || orderByValue === 'currentCapacity';
    }

    function isNumber(value: any): value is number {
      return !isNaN(value);
    }
  }

  public async clear(): Promise<void> {
    InMemoryCapacityTrackCourierRepository.couriers = [];
  }
}
