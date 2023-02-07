import { Injectable } from '@nestjs/common';
import { Freight } from '../entities/Freight';
import OrderItem from '../entities/OrderItem';
import { FreightServiceInterface } from './FreightServiceInterface';

@Injectable()
export class FreightService implements FreightServiceInterface {
  private calculateOrderItem(freight: Freight, item: OrderItem): void {
    const cost = item.quantity * freight.calculateMeasurementsCost(item.product.getMeasurements());
    freight.addCost(cost);
  }

  getCalculationFromOrderItem(orderItem: OrderItem, distance = 1000): Freight {
    const freight = new Freight(distance);
    this.calculateOrderItem(freight, orderItem);
    return freight;
  }

  getCalculationFromOrderItems(orderItems: OrderItem[], distance = 1000): Freight {
    return orderItems.reduce((freight, orderItem: OrderItem) => {
      this.calculateOrderItem(freight, orderItem);
      return freight;
    }, new Freight(distance));
  }
}
