import OrderItem from './OrderItem';

export default class OrderSolicitation {
  private finalTotalAmount: number;
  private items: Array<OrderItem>;

  constructor(items: Array<OrderItem> = new Array<OrderItem>()) {
    this.items = items;
  }

  addItem(item: OrderItem): void {
    this.items.push(item);
  }

  getFinalTotalAmount(): number {
    return this.finalTotalAmount;
  }
}
