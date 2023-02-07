import { OrderItemException, OrderItemExceptionType } from '../exceptions/OrderItemException';
import Product from './Product';

export default class OrderItem {
  product: Product;
  quantity: number;
  soldPrice: number;

  constructor(product: Product, quantity: number) {
    this.product = product;
    this.quantity = quantity;
    this.validateCreation();
  }

  setProduct(product: Product): void {
    this.product = product;
  }

  isInvalidQuantity(): boolean {
    return this.quantity <= 0;
  }

  private validateCreation(): void {
    if (this.isInvalidQuantity()) {
      throw new OrderItemException({
        type: OrderItemExceptionType.INVALID_QUANTITY,
      });
    }
  }
}
