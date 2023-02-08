import { Validate } from 'class-validator';
import {
  OrderSolicitationException,
  OrderSolicitationExceptionType,
} from '../../exceptions/OrderSolicitationException';
import { CpfValidator } from '../../validators/CpfValidator';
import { RepeatedOrderItemProductsValidator } from '../../validators/RepeatedOrderItemProductsValidator';
import OrderItem from '../OrderItem';
import Product from '../Product';
import { OrderItemInput } from './OrderItemInput';

export class OrderSolicitationPreviewPayloadInput {
  @Validate(CpfValidator)
  cpf: string;

  @Validate(RepeatedOrderItemProductsValidator)
  orderItems: Array<OrderItemInput>;

  coupon: string;
  constructor(orderItems?: Array<OrderItemInput>, coupon?: string) {
    this.orderItems = orderItems;
    this.coupon = coupon;
  }

  static getOrderItems(body: OrderSolicitationPreviewPayloadInput): OrderItem[] {
    if (OrderItemInput.hasRepeatedOrderItem(body.orderItems)) {
      throw new OrderSolicitationException({ type: OrderSolicitationExceptionType.INVALID_QUANTITY });
    }
    return body.orderItems.map<OrderItem>((item: OrderItemInput) => {
      const product = new Product(item.productId);
      return new OrderItem(product, item.quantity);
    });
  }
}

export class OrderSolicitationPreviewPayloadOutput {
  readonly totalAmount: number;
  readonly freightCost: number;
  constructor(totalAmount: number, freightCost: number) {
    this.totalAmount = parseFloat(totalAmount.toFixed(2));
    this.freightCost = parseFloat(freightCost.toFixed(2));
  }
}
