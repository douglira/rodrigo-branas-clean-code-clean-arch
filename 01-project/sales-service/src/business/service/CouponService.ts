import { Inject, Injectable } from '@nestjs/common';
import { CouponCodeValidationInput } from '../entities/dto/CouponCodeValidationInput';
import { CouponCodeValidationOutput } from '../entities/dto/CouponCodeValidationOutput';
import { CouponRepositoryInterface, COUPON_REPOSITORY } from '../repository/CouponRepositoryInterface';
import { CouponServiceInterface } from './CouponServiceInterface';

@Injectable()
export class CouponService implements CouponServiceInterface {
  constructor(@Inject(COUPON_REPOSITORY) private readonly couponRepository: CouponRepositoryInterface) {}

  async isCouponCodeValid(input: CouponCodeValidationInput): Promise<CouponCodeValidationOutput> {
    const coupon = await this.couponRepository.findByName(input.code);
    return new CouponCodeValidationOutput(!!coupon && !coupon.isExpired());
  }
}
