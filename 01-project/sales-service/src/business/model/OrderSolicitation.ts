import { OrderSolicitationException, OrderSolicitationExceptionType } from '../exceptions/OrderSolicitationException';
import Coupon from './Coupon';
import { Freight } from './Freight';
import OrderItem from './OrderItem';
import Product from './Product';

export default class OrderSolicitation {
  private finalTotalAmount: number;
  private items: Array<OrderItem>;
  private coupon: Coupon;
  private freight: Freight;

  constructor(items: Array<OrderItem> = new Array<OrderItem>(), coupon?: Coupon) {
    this.items = items;
    this.finalTotalAmount = 0;
    this.coupon = coupon;
    this.validateCreation();
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

  calculateFinalTotalAmountByProducts(products: Product[], coupon?: Coupon): void {
    if (products.length !== this.items.length)
      throw new OrderSolicitationException({
        type: OrderSolicitationExceptionType.PRODUCTS_LIST_DIFFER_ITEMS_LIST_FROM_AMOUNT_CALCULATION,
      });
    const itemsAndProductsPopulated = new Array<OrderItem>();
    this.items.forEach((item: OrderItem) => {
      const product = products.find((p: Product) => p.isEqualById(item.product));
      if (!product)
        throw new OrderSolicitationException({
          type: OrderSolicitationExceptionType.PRODUCT_NOT_FOUND_FROM_AMOUNT_CALCULATION,
        });
      itemsAndProductsPopulated.push(new OrderItem(product, item.quantity));
      this.finalTotalAmount += item.quantity * product.basePrice;
    });
    this.items = itemsAndProductsPopulated;
    if (coupon) {
      this.coupon = coupon;
    }
    this.applyDiscountOverFinalAmount();
    this.applyFreightOverFinalAmount();
  }

  private applyDiscountOverFinalAmount(): void {
    this.finalTotalAmount -= this.coupon.getDiscountAmount(this.finalTotalAmount);
  }

  private applyFreightOverFinalAmount(): void {
    this.freight = new Freight(1000);
    this.freight.calculateCost(this.items.map(({ product }: OrderItem) => product.getMeasurements()));
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

  private validateCreation(): void {
    if (this.hasRepeatedOrderItem()) {
      throw new OrderSolicitationException({ type: OrderSolicitationExceptionType.INVALID_QUANTITY });
    }
  }
}
