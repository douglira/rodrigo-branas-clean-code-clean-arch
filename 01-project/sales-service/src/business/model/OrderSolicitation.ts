import Coupon from './Coupon';
import OrderItem from './OrderItem';
import Product from './Product';

export default class OrderSolicitation {
  private finalTotalAmount: number;
  private items: Array<OrderItem>;
  private coupon: Coupon;
  private discountValue: number;

  constructor(items: Array<OrderItem> = new Array<OrderItem>(), coupon?: Coupon) {
    this.items = items;
    this.finalTotalAmount = 0;
    this.coupon = coupon;
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

  addItem(item: OrderItem): void {
    this.items.push(item);
  }

  calculateFinalTotalAmountByProducts(products: Product[], coupon?: Coupon): void {
    if (products.length !== this.items.length) throw new Error('Products list differs from items list');
    const itemsAndProductsPopulated = new Array<OrderItem>();
    this.items.forEach((item: OrderItem) => {
      const product = products.find((p: Product) => p.isEqualById(item.product));
      if (!product) throw new Error('Product not found to calculate final total amount');
      itemsAndProductsPopulated.push(new OrderItem(product, item.quantity));
      this.finalTotalAmount += item.quantity * product.basePrice;
    });
    if (coupon) {
      this.coupon = coupon;
    }
    this.calculateDiscountOverFinalAmount();
  }

  private calculateDiscountOverFinalAmount(): void {
    this.finalTotalAmount -= this.coupon.getDiscountAmount(this.finalTotalAmount);
  }

  hasCouponCode(): boolean {
    return !!this.coupon && !!this.coupon.name;
  }

  hasCoupon(): boolean {
    return !!this.coupon && this.coupon.hasCoupon();
  }
}
