import {
  Controller,
  Inject,
  UsePipes,
  ValidationPipe,
  UseFilters,
  HttpCode,
  HttpStatus,
  Param,
  Get,
} from '@nestjs/common';
import { BusinessExceptionFilter } from '../../exceptions/BusinessExceptionFilter';
import { CouponCodeValidationInput } from '../../../../business/entities/dto/CouponCodeValidationInput';
import { CouponCodeValidationOutput } from '../../../../business/entities/dto/CouponCodeValidationOutput';
import {
  VALIDATE_COUPON_EXPIRATION,
  ValidateCouponExpirationInterface,
} from '../../../../business/usecase/coupon/ValidateCouponExpirationInterface';

@Controller({
  path: 'coupon',
  version: '1',
})
@UseFilters(BusinessExceptionFilter)
export class CouponControllerV1 {
  constructor(
    @Inject(VALIDATE_COUPON_EXPIRATION) private readonly validateCouponExpiration: ValidateCouponExpirationInterface,
  ) {}

  @Get(':code/validate')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async calculate(@Param('code') code: string): Promise<CouponCodeValidationOutput> {
    return this.validateCouponExpiration.execute(new CouponCodeValidationInput(code));
  }
}
