export class OrderItemInput {
  productId: string;
  quantity: number;

  constructor(productId?: string, quantity?: number) {
    this.productId = productId;
    this.quantity = quantity;
  }

  static hasRepeatedOrderItem(items: OrderItemInput[]): boolean {
    const validation = true;
    if (!items) return validation;
    if (!Array.isArray(items)) return validation;
    if (!items.length) return validation;
    return items.some((item: OrderItemInput, itemIndex: number, arr: OrderItemInput[]) =>
      arr.some(({ productId }: OrderItemInput, index: number) => productId == item.productId && index != itemIndex),
    );
  }
}
