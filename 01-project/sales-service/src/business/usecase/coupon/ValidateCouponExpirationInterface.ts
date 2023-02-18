import { CouponCodeValidationInput } from '../../entities/dto/CouponCodeValidationInput';
import { CouponCodeValidationOutput } from '../../entities/dto/CouponCodeValidationOutput';

export const VALIDATE_COUPON_EXPIRATION = 'VALIDATE COUPON EXPIRATION';

export interface ValidateCouponExpirationInterface {
  execute(input: CouponCodeValidationInput): Promise<CouponCodeValidationOutput>;
}
