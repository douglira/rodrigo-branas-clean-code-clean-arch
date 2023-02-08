import { OrderItemInput } from '../entities/dto/OrderItemInput';
import OrderItem from '../entities/OrderItem';

export const ORDER_ITEM_SERVICE = 'ORDER ITEM SERVICE';

export interface OrderItemServiceInterface {
  getOrderItemsWithProducts(items: OrderItemInput[]): Promise<OrderItem[]>;
}
