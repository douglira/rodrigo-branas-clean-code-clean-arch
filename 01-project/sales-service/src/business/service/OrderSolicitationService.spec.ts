import { Test, TestingModule } from '@nestjs/testing';
import Product from '../entities/Product';
import { ProductRepositoryInterface, PRODUCT_REPOSITORY } from '../repository/ProductRepositoryInterface';
import { OrderSolicitationService } from './OrderSolicitationService';
import { OrderSolicitationServiceInterface, ORDER_SOLICITATION_SERVICE } from './OrderSolicitationServiceInterface';
import { PRODUCT_DATABASE } from '../../adapters/storage/data/ProductDatabaseInterface';
import { ProductRepository } from '../repository/ProductRepository';
import Coupon from '../entities/Coupon';
import { CouponRepositoryInterface, COUPON_REPOSITORY } from '../repository/CouponRepositoryInterface';
import { CouponRepository } from '../repository/CouponRepository';
import { COUPON_DATABASE } from '../../adapters/storage/data/CouponDatabaseInterface';
import { CouponException, CouponExceptionType } from '../exceptions/CouponException';
import { OrderSolicitationPreviewPayloadInput } from '../entities/dto/OrderSolicitationPreviewPayload';
import { OrderSolicitationException, OrderSolicitationExceptionType } from '../exceptions/OrderSolicitationException';
import { Measurements } from '../entities/Measurements';
import { FREIGHT_SERVICE } from './FreightServiceInterface';
import { FreightService } from './FreightService';
import { OrderItemInput } from '../entities/dto/OrderItemInput';
import { OrderItemService } from './OrderItemService';
import { ORDER_ITEM_SERVICE } from './OrderItemServiceInterface';

describe('Service:OrderSolicitation', () => {
  let orderSolicitationService: OrderSolicitationServiceInterface;
  let productRepository: ProductRepositoryInterface;
  let couponRepository: CouponRepositoryInterface;

  beforeEach(async () => {
    const serviceRefTestModule: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: ORDER_SOLICITATION_SERVICE, useClass: OrderSolicitationService },
        { provide: PRODUCT_REPOSITORY, useClass: ProductRepository },
        { provide: ORDER_ITEM_SERVICE, useClass: OrderItemService },
        { provide: PRODUCT_DATABASE, useValue: () => Promise.resolve() },
        { provide: COUPON_REPOSITORY, useClass: CouponRepository },
        { provide: COUPON_DATABASE, useValue: () => Promise.resolve() },
        { provide: FREIGHT_SERVICE, useClass: FreightService },
      ],
    }).compile();

    orderSolicitationService = await serviceRefTestModule.resolve(ORDER_SOLICITATION_SERVICE);
    productRepository = await serviceRefTestModule.resolve(PRODUCT_REPOSITORY);
    couponRepository = await serviceRefTestModule.resolve(COUPON_REPOSITORY);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('calculatePreview', () => {
    it('should calculate final total order amount with 3 order items, no coupon and freight', async () => {
      const items = new Array<OrderItemInput>(
        new OrderItemInput('ID1', 3),
        new OrderItemInput('ID2', 1),
        new OrderItemInput('ID3', 1),
      );
      const orderSolicitationInput = new OrderSolicitationPreviewPayloadInput(items);
      const productRepositoryMock = jest
        .spyOn(productRepository, 'findByIds')
        .mockImplementation(() =>
          Promise.resolve(
            new Array<Product>(
              new Product('ID1', 'P1', 15, new Measurements(10, 15, 20, 2)),
              new Product('ID2', 'P1', 40, new Measurements(30, 40, 60, 2.5)),
              new Product('ID3', 'P1', 90, new Measurements(80, 120, 220, 10)),
            ),
          ),
        );
      const result = await orderSolicitationService.calculatePreview(orderSolicitationInput);
      expect(productRepositoryMock).toBeCalledTimes(1);
      expect(result.totalAmount).toBe(359.99);
      expect(result.freightCost).toBe(184.99);
    });
    it('should calculate final total order amount with 4 order items, 1 discount coupon and freight', async () => {
      const items = new Array<OrderItemInput>(
        new OrderItemInput('ID1', 3),
        new OrderItemInput('ID2', 1),
        new OrderItemInput('ID3', 1),
        new OrderItemInput('ID4', 1),
      );
      const couponCode = 'VALE30';
      const orderSolicitationInput = new OrderSolicitationPreviewPayloadInput(items, couponCode);
      const productRepositoryMock = jest
        .spyOn(productRepository, 'findByIds')
        .mockImplementation(() =>
          Promise.resolve(
            new Array<Product>(
              new Product('ID1', 'P1', 15, new Measurements(10, 15, 20, 2)),
              new Product('ID2', 'P2', 40, new Measurements(30, 40, 60, 2.5)),
              new Product('ID3', 'P3', 20, new Measurements(80, 120, 220, 10)),
              new Product('ID4', 'P4', 70, new Measurements(220, 300, 430, 16)),
            ),
          ),
        );
      const couponRepositotyMock = jest
        .spyOn(couponRepository, 'findByName')
        .mockImplementation(() => Promise.resolve(new Coupon('ID1', 'VALE30', 30)));
      const result = await orderSolicitationService.calculatePreview(orderSolicitationInput);
      expect(productRepositoryMock).toBeCalledTimes(1);
      expect(couponRepositotyMock).toBeCalledTimes(1);
      expect(result.totalAmount).toBe(467.49);
      expect(result.freightCost).toBe(344.99);
    });
    it('should error when calculate final total order amount for expired discount', async () => {
      const items = new Array<OrderItemInput>(
        new OrderItemInput('ID2', 1),
        new OrderItemInput('ID3', 1),
        new OrderItemInput('ID4', 1),
      );
      const couponCode = 'VALE30';
      const orderSolicitationInput = new OrderSolicitationPreviewPayloadInput(items, couponCode);
      const productRepositoryMock = jest
        .spyOn(productRepository, 'findByIds')
        .mockImplementation(() =>
          Promise.resolve(
            new Array<Product>(
              new Product('ID2', 'P2', 40, new Measurements(30, 40, 60, 2.5)),
              new Product('ID3', 'P3', 20, new Measurements(80, 120, 220, 10)),
              new Product('ID4', 'P4', 70, new Measurements(220, 300, 430, 16)),
            ),
          ),
        );
      const FIVE_HOURS_MILLISECONDS = 1000 * 60 * 60 * 5;
      const expiredData = Date.now() - FIVE_HOURS_MILLISECONDS;
      const couponRepositotyMock = jest
        .spyOn(couponRepository, 'findByName')
        .mockImplementation(() => Promise.resolve(new Coupon('ID1', 'VALE30', 30, new Date(expiredData))));
      const rejectionPromise = orderSolicitationService.calculatePreview(orderSolicitationInput);
      await expect(rejectionPromise).rejects.toThrow(CouponException);
      await expect(rejectionPromise).rejects.toThrow(CouponExceptionType.COUPON_EXPIRED.toString());
      expect(productRepositoryMock).toBeCalledTimes(1);
      expect(couponRepositotyMock).toBeCalledTimes(1);
    });
    it('should error when calculate final total order amount for repeated order item products', async () => {
      const items = new Array<OrderItemInput>(
        new OrderItemInput('ID2', 1),
        new OrderItemInput('ID3', 1),
        new OrderItemInput('ID3', 1),
      );
      const couponCode = 'VALE30';
      const orderSolicitationInput = new OrderSolicitationPreviewPayloadInput(items, couponCode);
      jest
        .spyOn(productRepository, 'findByIds')
        .mockImplementation(() =>
          Promise.resolve(
            new Array<Product>(
              new Product('ID2', 'P2', 40, new Measurements(30, 40, 60, 2.5)),
              new Product('ID3', 'P3', 20, new Measurements(80, 120, 220, 10)),
              new Product('ID4', 'P4', 70, new Measurements(220, 300, 430, 16)),
            ),
          ),
        );
      const FIVE_HOURS_MILLISECONDS = 1000 * 60 * 60 * 5;
      const expiredData = Date.now() + FIVE_HOURS_MILLISECONDS;
      jest
        .spyOn(couponRepository, 'findByName')
        .mockImplementation(() => Promise.resolve(new Coupon('ID1', 'VALE30', 30, new Date(expiredData))));
      const rejectionPromise = orderSolicitationService.calculatePreview(orderSolicitationInput);
      await expect(rejectionPromise).rejects.toThrow(OrderSolicitationException);
      await expect(rejectionPromise).rejects.toThrow(OrderSolicitationExceptionType.INVALID_QUANTITY.toString());
    });
  });
});
