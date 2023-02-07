import { OrderSolicitationException, OrderSolicitationExceptionType } from '../exceptions/OrderSolicitationException';
import Coupon from './Coupon';
import Freight from './Freight';
import OrderItem from './OrderItem';
import Product from './Product';

export default class OrderSolicitation {
  private cpf: string;
  private finalTotalAmount: number;
  private items: Array<OrderItem>;
  private coupon: Coupon;
  private freight: Freight;

  constructor(items: Array<OrderItem> = new Array<OrderItem>(), coupon?: Coupon, freight?: Freight) {
    this.items = items;
    this.finalTotalAmount = 0;
    this.coupon = coupon;
    this.freight = freight;
    this.validateCreation();
    this.addFreightCost();
  }

  private validateCreation(): void {
    if (this.hasRepeatedOrderItem()) {
      throw new OrderSolicitationException({ type: OrderSolicitationExceptionType.INVALID_QUANTITY });
    }
  }

  private addFreightCost(): void {
    this.finalTotalAmount += this.freight.getCost();
  }

  setCpf(cpf: string): void {
    this.cpf = cpf;
  }

  getCpf(): string {
    return this.cpf;
  }

  getItems(): OrderItem[] {
    return this.items;
  }

  getFinalTotalAmount(): number {
    return this.finalTotalAmount;
  }

  getCoupon(): Coupon {
    return this.coupon;
  }

  getFreightCost(): number {
    return this.freight.getCost();
  }

  addItem(item: OrderItem): void {
    this.items.push(item);
  }

  addProduct(product: Product, quantity: number): void {
    this.items.push(new OrderItem(product, quantity));
  }

  setCoupon(coupon: Coupon): void {
    this.coupon = coupon;
  }

  calculateFinalTotalAmount(): void {
    this.finalTotalAmount = this.items.reduce((amount, item: OrderItem) => {
      return amount + item.quantity * item.product.basePrice;
    }, 0);
    this.applyDiscountOverFinalAmount();
    this.applyFreightOverFinalAmount();
  }

  private applyDiscountOverFinalAmount(): void {
    if (this.coupon) {
      this.finalTotalAmount -= this.coupon.getDiscountAmount(this.finalTotalAmount);
    }
  }

  private applyFreightOverFinalAmount(): void {
    this.finalTotalAmount += this.freight.getCost();
  }

  hasCouponCode(): boolean {
    return !!this.coupon && !!this.coupon.name;
  }

  hasCoupon(): boolean {
    return !!this.coupon && this.coupon.hasCoupon();
  }

  hasRepeatedOrderItem(): boolean {
    return this.items.some((item: OrderItem, itemIndex: number, arr: OrderItem[]) =>
      arr.some(({ product }: OrderItem, index: number) => product.isEqualById(item.product) && index != itemIndex),
    );
  }
}
