import {
  OrderSolicitationException,
  OrderSolicitationExceptionType,
} from '../../exceptions/OrderSolicitationException';
import OrderItem from '../OrderItem';
import { OrderSolicitationPreviewPayloadInput } from './OrderSolicitationPreviewPayload';
import { OrderItemInput } from './OrderItemInput';

describe('DTO:OrderSolicitationPreviewPayload', () => {
  it('should get order items by order solicitation preview input', () => {
    const input = new OrderSolicitationPreviewPayloadInput(
      new Array<OrderItemInput>(new OrderItemInput('PD1', 1), new OrderItemInput('PD2', 1)),
    );
    const result = OrderSolicitationPreviewPayloadInput.getOrderItems(input);
    expect(result).toBeInstanceOf(Array<OrderItem>);
    expect(result.length).toEqual(2);
  });
  it('should throw error for repeated product ids', () => {
    const input = new OrderSolicitationPreviewPayloadInput(
      new Array<OrderItemInput>(new OrderItemInput('PD1', 1), new OrderItemInput('PD1', 1)),
    );
    const expectFn = () => OrderSolicitationPreviewPayloadInput.getOrderItems(input);
    expect(expectFn).toThrow(OrderSolicitationException);
    expect(expectFn).toThrow(OrderSolicitationExceptionType.INVALID_QUANTITY.toString());
  });
});
