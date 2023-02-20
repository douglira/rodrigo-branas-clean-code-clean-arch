import { Test, TestingModule } from '@nestjs/testing';
import { COUPON_DATABASE } from '../../../adapters/storage/data/CouponDatabaseInterface';
import Coupon from '../../entities/Coupon';
import { CouponCodeValidationInput } from '../../entities/dto/CouponCodeValidationInput';
import { CouponRepository } from '../../repository/CouponRepository';
import { CouponRepositoryInterface, COUPON_REPOSITORY } from '../../repository/CouponRepositoryInterface';
import { ValidateCouponExpiration } from './ValidateCouponExpiration';

describe('UseCase:ValidateCouponExpiration', () => {
  let validateCouponExpiration: ValidateCouponExpiration;
  let couponRepository: CouponRepositoryInterface;

  beforeEach(async () => {
    const usecaseRefTestModule: TestingModule = await Test.createTestingModule({
      providers: [
        ValidateCouponExpiration,
        { provide: COUPON_REPOSITORY, useClass: CouponRepository },
        { provide: COUPON_DATABASE, useValue: () => Promise.resolve() },
      ],
    }).compile();
    validateCouponExpiration = await usecaseRefTestModule.resolve(ValidateCouponExpiration);
    couponRepository = await usecaseRefTestModule.resolve(COUPON_REPOSITORY);
  });

  it('should verify if coupon code is valid', async () => {
    const couponValidationInput = new CouponCodeValidationInput('VALE25');
    const TEN_DAYS_MILLISECONDS = 1000 * 60 * 60 * 24 * 10;
    const couponRepositoryMock = jest
      .spyOn(couponRepository, 'findByName')
      .mockResolvedValue(new Coupon('ID1', 'VALE25', 25, new Date(Date.now() + TEN_DAYS_MILLISECONDS)));
    const couponCodeValidation = await validateCouponExpiration.execute(couponValidationInput);
    expect(couponCodeValidation.isValidCoupon).toBeTruthy();
    expect(couponRepositoryMock).toBeCalledTimes(1);
  });

  it('should verify if coupon code is not valid', async () => {
    const couponValidationInput = new CouponCodeValidationInput('VALE25');
    const TEN_DAYS_MILLISECONDS = 1000 * 60 * 60 * 24 * 10;
    const couponRepositoryMock = jest
      .spyOn(couponRepository, 'findByName')
      .mockResolvedValue(new Coupon('ID1', 'VALE25', 25, new Date(Date.now() - TEN_DAYS_MILLISECONDS)));
    const couponCodeValidation = await validateCouponExpiration.execute(couponValidationInput);
    expect(couponCodeValidation.isValidCoupon).toBeFalsy();
    expect(couponRepositoryMock).toBeCalledTimes(1);
  });

  it('should verify if coupon code is not valid when not found in database', async () => {
    const couponValidationInput = new CouponCodeValidationInput('VAL30');
    const couponRepositoryMock = jest.spyOn(couponRepository, 'findByName').mockResolvedValue(undefined);
    const couponCodeValidation = await validateCouponExpiration.execute(couponValidationInput);
    expect(couponCodeValidation.isValidCoupon).toBeFalsy();
    expect(couponRepositoryMock).toBeCalledTimes(1);
  });
});
