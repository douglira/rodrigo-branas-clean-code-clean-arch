type outputOrder = { total: number; freight: number; coupon: string; serialCode: string; createdAt: Date };

export class ListUserOrdersOutput {
  orders: outputOrder[];
  constructor() {
    this.orders = new Array<outputOrder>();
  }

  addOrder(order: outputOrder) {
    this.orders.push(order);
  }
}
