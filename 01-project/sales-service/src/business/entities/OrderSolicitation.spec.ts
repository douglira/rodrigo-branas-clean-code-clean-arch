import { OrderSolicitationException, OrderSolicitationExceptionType } from '../exceptions/OrderSolicitationException';
import Coupon from './Coupon';
import OrderItem from './OrderItem';
import OrderSolicitation from './OrderSolicitation';
import Product from './Product';
import Freight from './Freight';

describe('Entity:OrderSolicitation', () => {
  it('should throw error when initialize with repeated order items', () => {
    const throwFn = () =>
      new OrderSolicitation(
        new Array<OrderItem>(new OrderItem(new Product('ID1'), 1), new OrderItem(new Product('ID1'), 2)),
      );
    expect(throwFn).toThrow(OrderSolicitationException);
    expect(throwFn).toThrow(OrderSolicitationExceptionType.INVALID_QUANTITY.toString());
  });
  it('should add freight cost when initialize order solicitation', () => {
    const freight = new Freight(1000);
    freight.addCost(129);
    const orderSolicitation = new OrderSolicitation(
      new Array<OrderItem>(new OrderItem(new Product('ID2'), 1), new OrderItem(new Product('ID1'), 2)),
      new Coupon(),
      freight,
    );
    expect(orderSolicitation.getFinalTotalAmount()).toEqual(129);
  });
  it('should calculate final total amount', () => {
    const freight = new Freight(1000);
    freight.addCost(150);
    const orderSolicitation = new OrderSolicitation(
      new Array<OrderItem>(
        new OrderItem(new Product('ID2', 'A', 200), 1),
        new OrderItem(new Product('ID1', 'B', 190), 2),
      ),
      new Coupon(),
      freight,
    );
    orderSolicitation.calculateFinalTotalAmount();
    expect(orderSolicitation.getFinalTotalAmount()).toEqual(730);
  });
  it('should calculate final total amount with coupon', () => {
    const TEN_DAYS_MILLISECONDS = 1000 * 60 * 60 * 24 * 10;
    const freight = new Freight(1000);
    freight.addCost(150);
    const orderSolicitation = new OrderSolicitation(
      new Array<OrderItem>(
        new OrderItem(new Product('ID2', 'A', 200), 1),
        new OrderItem(new Product('ID1', 'B', 190), 2),
      ),
      new Coupon('ID1', 'VALE20', 20, new Date(Date.now() + TEN_DAYS_MILLISECONDS)),
      freight,
    );
    orderSolicitation.calculateFinalTotalAmount();
    expect(orderSolicitation.getFinalTotalAmount()).toEqual(614);
  });
});
