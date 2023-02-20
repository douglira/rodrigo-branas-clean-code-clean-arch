import OrderItem from '../OrderItem';

export class GetOrderOutput {
  constructor(
    readonly total: number,
    readonly freight: number,
    readonly coupon: string,
    readonly serialCode: string,
    readonly items: OrderItem[],
    readonly createdAt: Date,
  ) {}
}
