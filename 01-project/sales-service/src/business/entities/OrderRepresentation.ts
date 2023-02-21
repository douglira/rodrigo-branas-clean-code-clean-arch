import OrderItem from './OrderItem';

export default class OrderRepresentation {
  constructor(
    readonly id: string,
    readonly serialCode?: string,
    readonly createdAt?: Date,
    readonly cpf?: string,
    readonly totalAmount?: number,
    readonly freightPrice?: number,
    readonly couponCode?: string,
    readonly items?: OrderItem[],
  ) {}
}
