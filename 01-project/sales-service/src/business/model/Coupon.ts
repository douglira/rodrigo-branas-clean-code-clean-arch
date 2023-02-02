export default class Coupon {
  id: string;
  name: string;
  discount: number;

  constructor(id?: string, name?: string, discount?: number) {
    this.id = id;
    this.name = name;
    this.discount = discount || 0;
  }

  hasCoupon(): boolean {
    return this.discount > 0 && !!this.name;
  }
}
