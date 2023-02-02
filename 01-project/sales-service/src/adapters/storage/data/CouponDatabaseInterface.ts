export const COUPON_DATABASE = 'COUPON DATABASE';

export interface CouponDatabaseInterface {
  findByName(name: string): Promise<any>;
}
