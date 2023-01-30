import OrderItem from './OrderItem';
import Product from './Product';

export default class OrderSolicitation {
  private finalTotalAmount: number;
  private items: Array<OrderItem>;
  private percentualDiscountCoupon: number;
  private discountValue: number;

  constructor(items: Array<OrderItem> = new Array<OrderItem>(), percentualDiscountCoupon?: number) {
    this.items = items;
    this.finalTotalAmount = 0;
    this.percentualDiscountCoupon = percentualDiscountCoupon;
  }

  getItems(): OrderItem[] {
    return this.items;
  }

  getFinalTotalAmount(): number {
    return this.finalTotalAmount;
  }

  addItem(item: OrderItem): void {
    this.items.push(item);
  }

  calculateFinalTotalAmountByProducts(products: Product[]): void {
    if (products.length !== this.items.length) throw new Error('Products list differs from items list');
    const itemsAndProductsPopulated = new Array<OrderItem>();
    this.items.forEach((item: OrderItem) => {
      const product = products.find((p: Product) => p.id === item.product.id);
      if (!product) throw new Error('Product not found to calculate final total amount');
      itemsAndProductsPopulated.push(new OrderItem(product, item.quantity));
      this.finalTotalAmount = this.finalTotalAmount + item.quantity * product.basePrice;
    });
  }

  calculateDiscountOverFinalAmount(): void {
    if (this.percentualDiscountCoupon && this.percentualDiscountCoupon > 0) {
      this.discountValue = this.finalTotalAmount * (this.percentualDiscountCoupon / 100);
      this.finalTotalAmount = this.finalTotalAmount - this.discountValue;
    }
  }
}
