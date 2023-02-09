import { CouponCodeValidationInput } from '../entities/dto/CouponCodeValidationInput';
import { CouponCodeValidationOutput } from '../entities/dto/CouponCodeValidationOutput';

export const COUPON_SERVICE = 'COUPON SERVICE';

export interface CouponServiceInterface {
  isCouponCodeValid(couponCode: CouponCodeValidationInput): Promise<CouponCodeValidationOutput>;
}
