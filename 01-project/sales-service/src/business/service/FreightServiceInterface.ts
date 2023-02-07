import { Freight } from '../entities/Freight';
import OrderItem from '../entities/OrderItem';

export const FREIGHT_SERVICE = 'FREIGHT SERVICE';

export interface FreightServiceInterface {
  getCalculationFromOrderItems(orderItems: OrderItem[], distance: number): Freight;
}
