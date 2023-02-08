import { FreightCalculatorOutput } from '../entities/dto/FreightCalculatorOutput';
import { OrderItemInput } from '../entities/dto/OrderItemInput';
import Freight from '../entities/Freight';
import OrderItem from '../entities/OrderItem';

export const FREIGHT_SERVICE = 'FREIGHT SERVICE';

export interface FreightServiceInterface {
  calculateByProducts(orderItemsInput: OrderItemInput[], distance: number): Promise<FreightCalculatorOutput>;
  getCalculationFromOrderItem(orderItem: OrderItem, distance: number): Freight;
  getCalculationFromOrderItems(orderItems: OrderItem[], distance: number): Freight;
}
