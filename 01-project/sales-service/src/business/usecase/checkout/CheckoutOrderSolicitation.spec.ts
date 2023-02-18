import { Test, TestingModule } from '@nestjs/testing';
import Product from '../../entities/Product';
import { ProductRepositoryInterface, PRODUCT_REPOSITORY } from '../../repository/ProductRepositoryInterface';
import { PRODUCT_DATABASE } from '../../../adapters/storage/data/ProductDatabaseInterface';
import { ProductRepository } from '../../repository/ProductRepository';
import Coupon from '../../entities/Coupon';
import { CouponRepositoryInterface, COUPON_REPOSITORY } from '../../repository/CouponRepositoryInterface';
import { CouponRepository } from '../../repository/CouponRepository';
import { COUPON_DATABASE } from '../../../adapters/storage/data/CouponDatabaseInterface';
import { CouponException, CouponExceptionType } from '../../exceptions/CouponException';
import { OrderSolicitationPreviewPayloadInput } from '../../entities/dto/OrderSolicitationPreviewPayload';
import {
  OrderSolicitationException,
  OrderSolicitationExceptionType,
} from '../../exceptions/OrderSolicitationException';
import { Measurements } from '../../entities/Measurements';
import { OrderItemInput } from '../../entities/dto/OrderItemInput';
import { CheckoutOrderSolicitation } from './CheckoutOrderSolicitation';
import OrderRepresentation from '../../entities/OrderRepresentation';
import { ORDER_DATABASE } from '../../../adapters/storage/data/OrderDatabaseInterface';
import { OrderRepository } from '../../repository/OrderRepository';
import { OrderRepositoryInterface, ORDER_REPOSITORY } from '../../repository/OrderRepositoryInterface';

describe('UseCase:CheckoutOrderSolicitation', () => {
  let checkoutOrderSolicitation: CheckoutOrderSolicitation;
  let productRepository: ProductRepositoryInterface;
  let couponRepository: CouponRepositoryInterface;
  let orderRepository: OrderRepositoryInterface;

  beforeEach(async () => {
    const useCaseRefTestModule: TestingModule = await Test.createTestingModule({
      providers: [
        CheckoutOrderSolicitation,
        { provide: PRODUCT_REPOSITORY, useClass: ProductRepository },
        { provide: PRODUCT_DATABASE, useValue: () => Promise.resolve() },
        { provide: COUPON_REPOSITORY, useClass: CouponRepository },
        { provide: COUPON_DATABASE, useValue: () => Promise.resolve() },
        { provide: ORDER_REPOSITORY, useClass: OrderRepository },
        { provide: ORDER_DATABASE, useValue: () => Promise.resolve() },
      ],
    }).compile();

    checkoutOrderSolicitation = await useCaseRefTestModule.resolve(CheckoutOrderSolicitation);
    productRepository = await useCaseRefTestModule.resolve(PRODUCT_REPOSITORY);
    couponRepository = await useCaseRefTestModule.resolve(COUPON_REPOSITORY);
    orderRepository = await useCaseRefTestModule.resolve(ORDER_REPOSITORY);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('preview', () => {
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
      const result = await checkoutOrderSolicitation.preview(orderSolicitationInput);
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
      const result = await checkoutOrderSolicitation.preview(orderSolicitationInput);
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
      const rejectionPromise = checkoutOrderSolicitation.preview(orderSolicitationInput);
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
      const rejectionPromise = checkoutOrderSolicitation.preview(orderSolicitationInput);
      await expect(rejectionPromise).rejects.toThrow(OrderSolicitationException);
      await expect(rejectionPromise).rejects.toThrow(OrderSolicitationExceptionType.INVALID_QUANTITY.toString());
    });
  });

  describe('execute', () => {
    it('should register order and generate an identifier order code', async () => {
      const items = new Array<OrderItemInput>(new OrderItemInput('ID1', 3), new OrderItemInput('ID2', 1));
      const couponCode = 'VALE30';
      const orderSolicitationInput = new OrderSolicitationPreviewPayloadInput(items, couponCode);
      const productRepositoryMock = jest
        .spyOn(productRepository, 'findByIds')
        .mockImplementation(() =>
          Promise.resolve(
            new Array<Product>(
              new Product('ID1', 'P1', 15, new Measurements(10, 15, 20, 2)),
              new Product('ID2', 'P2', 40, new Measurements(30, 40, 60, 2.5)),
            ),
          ),
        );
      const couponRepositotyMock = jest
        .spyOn(couponRepository, 'findByName')
        .mockImplementation(() => Promise.resolve(new Coupon('ID1', 'VALE30', 30)));
      const orderSolicitationServiceGenerateSpy = jest.spyOn(checkoutOrderSolicitation, 'generate');
      const orderRepositoryMock = jest
        .spyOn(orderRepository, 'create')
        .mockResolvedValue(new OrderRepresentation('ID1', '202300000001'));
      const result = await checkoutOrderSolicitation.execute(orderSolicitationInput);
      expect(productRepositoryMock).toBeCalledTimes(1);
      expect(couponRepositotyMock).toBeCalledTimes(1);
      expect(orderSolicitationServiceGenerateSpy).toBeCalledTimes(1);
      expect(orderRepositoryMock).toBeCalledTimes(1);
      expect(result.serialCode).toBe('202300000001');
    });
  });
});
