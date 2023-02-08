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
import { OrderSolicitationPreviewPayloadInput } from '../entities/dto/OrderSolicitationPreviewPayload';
import { Measurements } from '../entities/Measurements';
import { FREIGHT_SERVICE } from './FreightServiceInterface';
import { FreightService } from './FreightService';
import { OrderProcessorServiceInterface, ORDER_PROCESSOR_SERVICE } from './OrderProcessorServiceInterface';
import OrderRepresentation from '../entities/OrderRepresentation';
import { OrderRepositoryInterface, ORDER_REPOSITORY } from '../repository/OrderRepositoryInterface';
import { OrderRepository } from '../repository/OrderRepository';
import { ORDER_DATABASE } from '../../adapters/storage/data/OrderDatabaseInterface';
import { OrderProcessorService } from './OrderProcessorService';
import { OrderItemInput } from '../entities/dto/OrderItemInput';
import { OrderItemService } from './OrderItemService';
import { ORDER_ITEM_SERVICE } from './OrderItemServiceInterface';

describe('Service:OrderProcessor', () => {
  let orderProcessorService: OrderProcessorServiceInterface;
  let orderSolicitationService: OrderSolicitationServiceInterface;
  let productRepository: ProductRepositoryInterface;
  let couponRepository: CouponRepositoryInterface;
  let orderRepository: OrderRepositoryInterface;

  beforeEach(async () => {
    const serviceRefTestModule: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: ORDER_PROCESSOR_SERVICE, useClass: OrderProcessorService },
        { provide: ORDER_SOLICITATION_SERVICE, useClass: OrderSolicitationService },
        { provide: PRODUCT_REPOSITORY, useClass: ProductRepository },
        { provide: ORDER_ITEM_SERVICE, useClass: OrderItemService },
        { provide: PRODUCT_DATABASE, useValue: () => Promise.resolve() },
        { provide: COUPON_REPOSITORY, useClass: CouponRepository },
        { provide: COUPON_DATABASE, useValue: () => Promise.resolve() },
        { provide: FREIGHT_SERVICE, useClass: FreightService },
        { provide: ORDER_REPOSITORY, useClass: OrderRepository },
        { provide: ORDER_DATABASE, useValue: () => Promise.resolve() },
      ],
    }).compile();

    orderProcessorService = await serviceRefTestModule.resolve(ORDER_PROCESSOR_SERVICE);
    orderSolicitationService = await serviceRefTestModule.resolve(ORDER_SOLICITATION_SERVICE);
    productRepository = await serviceRefTestModule.resolve(PRODUCT_REPOSITORY);
    couponRepository = await serviceRefTestModule.resolve(COUPON_REPOSITORY);
    orderRepository = await serviceRefTestModule.resolve(ORDER_REPOSITORY);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

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
    const orderSolicitationServiceGenerateSpy = jest.spyOn(orderSolicitationService, 'generate');
    const orderRepositoryMock = jest
      .spyOn(orderRepository, 'create')
      .mockResolvedValue(new OrderRepresentation('ID1', '202300000001'));
    const result = await orderProcessorService.register(orderSolicitationInput);
    expect(productRepositoryMock).toBeCalledTimes(1);
    expect(couponRepositotyMock).toBeCalledTimes(1);
    expect(orderSolicitationServiceGenerateSpy).toBeCalledTimes(1);
    expect(orderRepositoryMock).toBeCalledTimes(1);
    expect(result.serialCode).toBe('202300000001');
  });
});
