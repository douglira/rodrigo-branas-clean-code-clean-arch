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
  orderItems: Array<OrderItemDTO>;

  constructor(orderItems?: Array<OrderItemDTO>) {
    this.orderItems = orderItems;
  }

  public static build(orderItems: Array<OrderItemDTO>): OrderSolicitation {
    const solicitation = new OrderSolicitation();
    orderItems.forEach((item) => {
      const product = new Product(item.productId);
      const orderItem = new OrderItem(product, item.quantity);
      solicitation.addItem(orderItem);
    });
    return solicitation;
  }
}

export class OrderSolicitationPreviewPayloadResponse {
  totalAmount: number;

  constructor(totalAmount: number) {
    this.totalAmount = totalAmount;
  }
}
