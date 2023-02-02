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
    const solicitation = new OrderSolicitation(new Array<OrderItem>(), new Coupon('', body.coupon));
    body.orderItems.forEach((item) => {
      const product = new Product(item.productId);
      const orderItem = new OrderItem(product, item.quantity);
      solicitation.addItem(orderItem);
    });
    return solicitation;
  }
}

export class OrderSolicitationPreviewPayloadResponse {
  constructor(private readonly totalAmount: number) {
    this.totalAmount = totalAmount;
  }
}
