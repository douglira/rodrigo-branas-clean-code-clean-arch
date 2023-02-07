import Freight from '../entities/Freight';
import OrderItem from '../entities/OrderItem';

export const FREIGHT_SERVICE = 'FREIGHT SERVICE';

export interface FreightServiceInterface {
  getCalculationFromOrderItem(orderItem: OrderItem, distance: number): Freight;
  getCalculationFromOrderItems(orderItems: OrderItem[], distance: number): Freight;
}
