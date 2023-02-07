import { OrderItemException, OrderItemExceptionType } from '../exceptions/OrderItemException';
import OrderItem from './OrderItem';
import Product from './Product';

describe('Entity:OrderItem', () => {
  it('should validate initialization of order item for negative quantity', () => {
    const throwFn = () => new OrderItem(new Product(), -1);
    expect(throwFn).toThrow(OrderItemException);
    expect(throwFn).toThrow(OrderItemExceptionType.INVALID_QUANTITY.toString());
  });
});
