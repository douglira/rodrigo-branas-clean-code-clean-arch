export default class OrderRepresentation {
  constructor(
    private id: string,
    private serialCode?: string,
    private createdAt?: Date,
    private cpf?: string,
    private totalAmount?: number,
    private freightPrice?: number,
    private couponCode?: string,
  ) {}

  getSerialCode(): string {
    return this.serialCode;
  }
}
