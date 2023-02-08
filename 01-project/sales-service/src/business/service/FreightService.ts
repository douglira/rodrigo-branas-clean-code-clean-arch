import { Inject, Injectable } from '@nestjs/common';
import { FreightCalculatorOutput } from '../entities/dto/FreightCalculatorOutput';
import { OrderItemInput } from '../entities/dto/OrderItemInput';
import Freight from '../entities/Freight';
import OrderItem from '../entities/OrderItem';
import { FreightServiceInterface } from './FreightServiceInterface';
import { OrderItemServiceInterface, ORDER_ITEM_SERVICE } from './OrderItemServiceInterface';

@Injectable()
export class FreightService implements FreightServiceInterface {
  constructor(@Inject(ORDER_ITEM_SERVICE) private readonly orderItemService: OrderItemServiceInterface) {}

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

  async calculateByProducts(orderItemsInput: OrderItemInput[], distance: number): Promise<FreightCalculatorOutput> {
    const orderItems = await this.orderItemService.getOrderItemsWithProducts(orderItemsInput);
    return new FreightCalculatorOutput(this.getCalculationFromOrderItems(orderItems, distance).getCost());
  }
}
