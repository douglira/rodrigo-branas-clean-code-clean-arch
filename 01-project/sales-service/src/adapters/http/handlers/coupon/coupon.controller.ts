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
import { CouponServiceInterface, COUPON_SERVICE } from '../../../../business/service/CouponServiceInterface';
import { CouponCodeValidationInput } from '../../../../business/entities/dto/CouponCodeValidationInput';
import { CouponCodeValidationOutput } from '../../../../business/entities/dto/CouponCodeValidationOutput';

@Controller({
  path: 'coupon',
  version: '1',
})
@UseFilters(BusinessExceptionFilter)
export class CouponControllerV1 {
  constructor(@Inject(COUPON_SERVICE) private readonly couponService: CouponServiceInterface) {}

  @Get(':code/validate')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async calculate(@Param('code') code: string): Promise<CouponCodeValidationOutput> {
    return this.couponService.isCouponCodeValid(new CouponCodeValidationInput(code));
  }
}
