import { OrderSolicitationException, OrderSolicitationExceptionType } from '../exceptions/OrderSolicitationException';
import Coupon from './Coupon';
import OrderItem from './OrderItem';
import Product from './Product';

export default class OrderSolicitation {
  private readonly cpf: string;
  private items: OrderItem[];
  private coupon: Coupon;
  private freight: number;

  constructor(cpf: string) {
    this.cpf = cpf;
    this.coupon = new Coupon();
    this.items = [];
    this.freight = 0;
  }

  getCpf(): string {
    return this.cpf;
  }

  getItems(): OrderItem[] {
    return this.items;
  }

  getCoupon(): Coupon {
    return this.coupon;
  }

  getFreight(): number {
    return this.freight;
  }

  isProductAlreadyExists(product: Product): number {
    return this.items.findIndex((item) => item.product.isEqualById(product));
  }

  addItem(product: Product, quantity: number): void {
    const productIndex = this.isProductAlreadyExists(product);
    if (productIndex != -1) {
      throw new OrderSolicitationException({
        type: OrderSolicitationExceptionType.DUPLICATED_PRODUCT,
      });
    }
    this.items.push(new OrderItem(product, quantity));
  }

  setCoupon(coupon: Coupon): void {
    if (coupon) {
      coupon.validateExpiration();
      this.coupon = coupon;
    }
  }

  setFreight(cost: number): void {
    this.freight = cost;
  }

  getTotal(): number {
    let total = this.items.reduce((amount, item: OrderItem) => {
      return amount + item.quantity * item.product.basePrice;
    }, 0);
    if (this.coupon) {
      total -= this.coupon.getDiscountAmount(total);
    }
    total += this.freight;
    return total;
  }

  hasCouponCode(): boolean {
    return !!this.coupon && !!this.coupon.name;
  }

  hasCoupon(): boolean {
    return !!this.coupon && this.coupon.hasCoupon();
  }

  getCouponId(): string {
    if (this.hasCoupon()) return this.coupon.id;
  }
}
