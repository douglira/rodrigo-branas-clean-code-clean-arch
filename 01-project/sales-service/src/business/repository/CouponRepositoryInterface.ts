import Coupon from '../entities/Coupon';

export const COUPON_REPOSITORY = 'COUPON REPOSITORY';

export interface CouponRepositoryInterface {
  findByName(name: string): Promise<Coupon>;
}
