import { Inject, Injectable } from '@nestjs/common';
import { CouponDatabaseInterface, COUPON_DATABASE } from '../../adapters/storage/data/CouponDatabaseInterface';
import { CouponRepositoryInterface } from './CouponRepositoryInterface';
import Coupon from '../entities/Coupon';

@Injectable()
export class CouponRepository implements CouponRepositoryInterface {
  constructor(@Inject(COUPON_DATABASE) private readonly couponDatabase: CouponDatabaseInterface) {}

  private factoryCouponByCouponsData(couponsData: any): Coupon[] {
    const coupons = new Array<Coupon>();
    couponsData.forEach((couponData) => {
      coupons.push(new Coupon(couponData.id, couponData.name, couponData.discount, couponData.expires_in));
    });
    return coupons;
  }

  async findByName(name: string): Promise<Coupon> {
    const result = await this.couponDatabase.findByName(name);
    const [coupon] = this.factoryCouponByCouponsData(result);
    return coupon;
  }
}
