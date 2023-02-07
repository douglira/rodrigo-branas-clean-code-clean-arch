import { Validate } from 'class-validator';
import {
  OrderSolicitationException,
  OrderSolicitationExceptionType,
} from '../../exceptions/OrderSolicitationException';
import { CpfValidator } from '../../validators/CpfValidator';
import OrderItem from '../OrderItem';
import Product from '../Product';

export class OrderItemDTO {
  productId: string;
  quantity: number;

  constructor(productId?: string, quantity?: number) {
    this.productId = productId;
    this.quantity = quantity;
  }
}

export class OrderSolicitationPreviewPayloadInput {
  @Validate(CpfValidator)
  cpf: string;
  orderItems: Array<OrderItemDTO>;
  coupon: string;
  constructor(orderItems?: Array<OrderItemDTO>, coupon?: string) {
    this.orderItems = orderItems;
    this.coupon = coupon;
  }

  static getOrderItems(body: OrderSolicitationPreviewPayloadInput): OrderItem[] {
    if (OrderSolicitationPreviewPayloadInput.hasRepeatedOrderItem(body.orderItems)) {
      throw new OrderSolicitationException({ type: OrderSolicitationExceptionType.INVALID_QUANTITY });
    }
    return body.orderItems.map<OrderItem>((item: OrderItemDTO) => {
      const product = new Product(item.productId);
      return new OrderItem(product, item.quantity);
    });
  }

  static hasRepeatedOrderItem(items: OrderItemDTO[]): boolean {
    return items.some((item: OrderItemDTO, itemIndex: number, arr: OrderItemDTO[]) =>
      arr.some(({ productId }: OrderItemDTO, index: number) => productId == item.productId && index != itemIndex),
    );
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
