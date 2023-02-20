import { OrderSolicitationException, OrderSolicitationExceptionType } from '../exceptions/OrderSolicitationException';
import Coupon from './Coupon';
import OrderSolicitation from './OrderSolicitation';
import Product from './Product';
import Freight from './Freight';

describe('Entity:OrderSolicitation', () => {
  it('should throw duplicated product error', () => {
    const order = new OrderSolicitation('cpf');
    const throwFn = () => {
      order.addItem(new Product('ID1'), 1);
      order.addItem(new Product('ID1'), 1);
    };
    expect(throwFn).toThrow(OrderSolicitationException);
    expect(throwFn).toThrow(OrderSolicitationExceptionType.DUPLICATED_PRODUCT.toString());
  });
  it('should calculate final total amount', () => {
    const freight = new Freight(1000);
    freight.addCost(150);
    const orderSolicitation = new OrderSolicitation('cpf');
    orderSolicitation.addItem(new Product('ID2', 'A', 200), 1);
    orderSolicitation.addItem(new Product('ID1', 'B', 190), 2);
    orderSolicitation.setFreight(freight.getCost());
    expect(orderSolicitation.getTotal()).toEqual(730);
  });
  it('should calculate final total amount with coupon', () => {
    const TEN_DAYS_MILLISECONDS = 1000 * 60 * 60 * 24 * 10;
    const orderSolicitation = new OrderSolicitation('cpf');
    orderSolicitation.addItem(new Product('ID2', 'A', 200), 1);
    orderSolicitation.addItem(new Product('ID1', 'B', 190), 2);
    orderSolicitation.setFreight(150);
    orderSolicitation.setCoupon(new Coupon('ID1', 'VALE20', 20, new Date(Date.now() + TEN_DAYS_MILLISECONDS)));
    expect(orderSolicitation.getTotal()).toEqual(614);
  });
});
