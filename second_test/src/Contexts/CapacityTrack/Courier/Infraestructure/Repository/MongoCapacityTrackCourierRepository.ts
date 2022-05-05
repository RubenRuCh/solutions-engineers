import { Operator } from './../../../../Shared/Domain/Criteria/FilterOperator';
import { Filter as MongoFilter, Sort as MongoSort } from 'mongodb';
import { Criteria } from '../../../../Shared/Domain/Criteria/Criteria';
import { Nullable } from '../../../../Shared/Domain/Nullable';
import { MongoRepository } from '../../../../Shared/Infraestructure/Repository/Mongo/MongoRepository';
import { CapacityTrackCourierNotFoundException } from '../../Domain/Exception/CapacityTrackCourierNotFoundException';
import { CapacityTrackCourier } from '../../Domain/Model/Entities/CapacityTrackCourier';
import { CapacityTrackCourierRepository } from '../../Domain/Model/Interfaces/Repository/CapacityTrackCourierRepository';
import { CapacityTrackCourierId } from '../../Domain/ValueObject/CapacityTrackCourierId';

interface CapacityTrackCourierDocument {
  _id: string;
  maxCapacity: number;
  currentCapacity: number;
}

export class MongoCapacityTrackCourierRepository
  extends MongoRepository<CapacityTrackCourier>
  implements CapacityTrackCourierRepository
{
  protected collectionName(): string {
    return 'couriers';
  }

  public async persist(courierToSave: CapacityTrackCourier): Promise<void> {
    return this.upsert(courierToSave.id.value, courierToSave);
  }

  public async delete(courierId: CapacityTrackCourierId): Promise<void> {
    const searchedCourier = await this.getById(courierId);

    if (!searchedCourier) {
      throw new CapacityTrackCourierNotFoundException(courierId.value);
    }

    return this.remove(courierId.value);
  }

  public async search(criteria: Criteria): Promise<CapacityTrackCourier[]> {
    const collection = await this.collection();
    const allDocuments = await collection
      .find<CapacityTrackCourierDocument>(this.mapCriteriaToMongoFilter(criteria))
      .sort(this.mapCriteriaToMongoSort(criteria))
      .toArray();

    return allDocuments.map(document =>
      CapacityTrackCourier.fromPrimitives({
        id: document._id,
        maxCapacity: document.maxCapacity,
        currentCapacity: document.currentCapacity
      })
    );
  }

  public async getById(courierId: CapacityTrackCourierId): Promise<Nullable<CapacityTrackCourier>> {
    const collection = await this.collection();
    const document = await collection.findOne<CapacityTrackCourierDocument>({ _id: courierId.value });

    return document
      ? CapacityTrackCourier.fromPrimitives({
          id: courierId.value,
          maxCapacity: document.maxCapacity,
          currentCapacity: document.currentCapacity
        })
      : null;
  }

  private mapCriteriaToMongoFilter(criteria: Criteria): MongoFilter<CapacityTrackCourierDocument> {
    const mongoFilter: MongoFilter<CapacityTrackCourierDocument> = {};

    if (criteria.filters.filters.length > 0) {
      criteria.filters.filters.forEach(filter => {
        const filterField = filter.field.value;
        const operator = filter.operator.value;
        const mongoOperator = this.mapCriteriaOperatorToMongoOperator(operator);

        if (filterField === 'currentCapacity') {
          mongoFilter.currentCapacity = { [mongoOperator]: +filter.value.value };
        }

        if (filterField === 'maxCapacity') {
          mongoFilter.maxCapacity = { [mongoOperator]: +filter.value.value };
        }
      });
    }

    return mongoFilter;
  }

  private mapCriteriaOperatorToMongoOperator(
    operator: Operator
  ): '$eq' | '$ne' | '$gt' | '$gte' | '$lt' | '$lte' | '$in' | '$nin' {
    switch (operator) {
      case Operator.EQUAL:
        return `$eq`;

      case Operator.NOT_EQUAL:
        return '$ne';

      case Operator.GT:
        return '$gt';

      case Operator.GTE:
        return `$gte`;

      case Operator.LT:
        return '$lt';

      case Operator.LTE:
        return '$lte';

      case Operator.CONTAINS:
        return '$in';

      case Operator.NOT_CONTAINS:
        return '$nin';

      default:
        throw new Error('Operator not supported');
    }
  }

  private mapCriteriaToMongoSort(criteria: Criteria): MongoSort {
    const mongoSort: MongoSort = {};
    const orderBy = criteria.order.orderBy;
    const orderType = criteria.order.orderType;

    mongoSort[orderBy.value] = orderType.isAsc() ? 1 : -1;

    return mongoSort;
  }

  public async clear(): Promise<void> {
    const collection = await this.collection();
    await collection.deleteMany({});
  }
}
