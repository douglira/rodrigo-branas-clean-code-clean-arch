import { CouponException, CouponExceptionType } from '../exceptions/CouponException';
import Coupon from './Coupon';

describe('Entity:Coupon', () => {
  const TEN_DAYS_MILLISECONDS = 1000 * 60 * 60 * 24 * 10;

  it('should return true checking if has coupon', () => {
    const coupon = new Coupon('ID1', 'VALE20', 20, new Date(Date.now() + TEN_DAYS_MILLISECONDS));
    expect(coupon.hasCoupon()).toBeTruthy();
  });
  it('should return false checking has coupon when discount lesser than 0', () => {
    const coupon = new Coupon('ID1', 'VALE20', -1, new Date(Date.now() + TEN_DAYS_MILLISECONDS));
    expect(coupon.hasCoupon()).toBeFalsy();
  });
  it('should return false checking has coupon when name not exists', () => {
    const coupon = new Coupon('ID1', '', 10, new Date(Date.now() + TEN_DAYS_MILLISECONDS));
    expect(coupon.hasCoupon()).toBeFalsy();
  });
  it('should coupon to be expired', () => {
    const coupon = new Coupon('ID1', 'VALE20', 20, new Date(Date.now() - TEN_DAYS_MILLISECONDS));
    expect(coupon.isExpired()).toBeTruthy();
  });
  it('should coupon not to be expired', () => {
    const coupon = new Coupon('ID1', 'VALE20', 20, new Date(Date.now() + TEN_DAYS_MILLISECONDS));
    expect(coupon.isExpired()).toBeFalsy();
  });
  it('should error when validate expiration for expired coupon', () => {
    const coupon = new Coupon('ID1', 'VALE20', 20, new Date(Date.now() - TEN_DAYS_MILLISECONDS));
    const expectFn = () => coupon.validateExpiration();
    expect(expectFn).toThrow(CouponException);
    expect(expectFn).toThrow(CouponExceptionType.COUPON_EXPIRED.toString());
  });
  it('should error when get discount amount of expired coupon', () => {
    const coupon = new Coupon('ID1', 'VALE20', 20, new Date(Date.now() - TEN_DAYS_MILLISECONDS));
    const expectFn = () => coupon.getDiscountAmount(1000);
    expect(expectFn).toThrow(CouponException);
    expect(expectFn).toThrow(CouponExceptionType.COUPON_EXPIRED.toString());
  });
  it.each([
    { name: '', discount: 10 },
    { name: 'VALE20', discount: -1 },
  ])('should return zero for invalid coupon name or discount value', ({ name, discount }) => {
    const coupon = new Coupon('ID1', name, discount, new Date(Date.now() + TEN_DAYS_MILLISECONDS));
    expect(coupon.getDiscountAmount(0)).toEqual(0);
  });
  it('should return calculated discount amount', () => {
    const coupon = new Coupon('ID1', 'VALE20', 20, new Date(Date.now() + TEN_DAYS_MILLISECONDS));
    expect(coupon.getDiscountAmount(0)).toEqual(0);
  });
});
