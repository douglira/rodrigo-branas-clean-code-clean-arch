import { Inject, Injectable } from '@nestjs/common';
import { CouponCodeValidationInput } from '../../entities/dto/CouponCodeValidationInput';
import { CouponCodeValidationOutput } from '../../entities/dto/CouponCodeValidationOutput';
import { CouponRepositoryInterface, COUPON_REPOSITORY } from '../../repository/CouponRepositoryInterface';
import { ValidateCouponExpirationInterface } from './ValidateCouponExpirationInterface';

@Injectable()
export class ValidateCouponExpiration implements ValidateCouponExpirationInterface {
  constructor(@Inject(COUPON_REPOSITORY) private readonly couponRepository: CouponRepositoryInterface) {}

  async execute(input: CouponCodeValidationInput): Promise<CouponCodeValidationOutput> {
    const coupon = await this.couponRepository.findByName(input.code);
    return new CouponCodeValidationOutput(!!coupon && !coupon.isExpired());
  }
}
