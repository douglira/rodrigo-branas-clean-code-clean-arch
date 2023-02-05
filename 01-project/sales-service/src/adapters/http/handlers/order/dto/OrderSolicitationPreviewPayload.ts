import { Validate } from 'class-validator';
import Coupon from '../../../../../business/model/Coupon';
import { CpfValidator } from '../../../../../business/validators/CpfValidator';
import OrderItem from './../../../../../business/model/OrderItem';
import OrderSolicitation from './../../../../../business/model/OrderSolicitation';
import Product from './../../../../../business/model/Product';

export class OrderItemDTO {
  productId: string;
  quantity: number;

  constructor(productId?: string, quantity?: number) {
    this.productId = productId;
    this.quantity = quantity;
  }
}

export class OrderSolicitationPreviewPayloadRequest {
  @Validate(CpfValidator)
  cpf: string;
  orderItems: Array<OrderItemDTO>;
  coupon: string;
  constructor(orderItems?: Array<OrderItemDTO>, coupon?: string) {
    this.orderItems = orderItems;
    this.coupon = coupon;
  }

  public static build(body: OrderSolicitationPreviewPayloadRequest): OrderSolicitation {
    const orderItems = new Array<OrderItem>();
    body.orderItems.forEach((item) => {
      const product = new Product(item.productId);
      const orderItem = new OrderItem(product, item.quantity);
      orderItems.push(orderItem);
    });
    return new OrderSolicitation(orderItems, new Coupon('', body.coupon));
  }
}

export class OrderSolicitationPreviewPayloadResponse {
  readonly totalAmount: number;
  readonly freightCost: number;
  constructor(totalAmount: number, freightCost: number) {
    this.totalAmount = parseFloat(totalAmount.toFixed(2));
    this.freightCost = parseFloat(freightCost.toFixed(2));
  }
}
