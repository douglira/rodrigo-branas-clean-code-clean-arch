import { CouponException, CouponExceptionType } from '../exceptions/CouponException';

export default class Coupon {
  id: string;
  name: string;
  discount: number;
  expiresIn: Date;

  constructor(id?: string, name?: string, discount?: number, expiresIn?: Date) {
    this.id = id;
    this.name = name;
    this.discount = discount || 0;
    this.expiresIn = expiresIn;
  }

  hasCoupon(): boolean {
    return this.discount > 0 && !!this.name;
  }

  getDiscountAmount(amount: number): number {
    if (this.hasCoupon()) {
      this.validateExpiration();
      return amount * (this.discount / 100);
    }
    return 0;
  }

  isExpired(): boolean {
    const now = new Date();
    return this.expiresIn < now;
  }

  validateExpiration(): void {
    if (this.isExpired()) {
      throw new CouponException({
        type: CouponExceptionType.COUPON_EXPIRED,
      });
    }
  }
}
