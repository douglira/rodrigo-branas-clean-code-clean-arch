import { Test, TestingModule } from '@nestjs/testing';
import { COUPON_REPOSITORY } from '../../../../business/repository/CouponRepositoryInterface';
import { PRODUCT_REPOSITORY } from '../../../../business/repository/ProductRepositoryInterface';
import { FreightService } from '../../../../business/service/FreightService';
import { FREIGHT_SERVICE } from '../../../../business/service/FreightServiceInterface';
import { OrderSolicitationService } from '../../../../business/service/OrderSolicitationService';
import {
  OrderSolicitationServiceInterface,
  ORDER_SOLICITATION_SERVICE,
} from '../../../../business/service/OrderSolicitationServiceInterface';
import {
  OrderSolicitationPreviewPayloadInput,
  OrderSolicitationPreviewPayloadOutput,
} from '../../../../business/entities/dto/OrderSolicitationPreviewPayload';
import { OrderControllerV1 } from './order.controller';
import { OrderProcessorService } from '../../../../business/service/OrderProcessorService';
import {
  OrderProcessorServiceInterface,
  ORDER_PROCESSOR_SERVICE,
} from '../../../../business/service/OrderProcessorServiceInterface';
import { ORDER_REPOSITORY } from '../../../../business/repository/OrderRepositoryInterface';
import { OrderProcessorOutput } from '../../../../business/entities/dto/OrderProcessorRegisterPayload';

describe('Controller:OrderV1', () => {
  let orderController: OrderControllerV1;
  let orderSolicitationService: OrderSolicitationServiceInterface;
  let orderProcessorService: OrderProcessorServiceInterface;

  beforeEach(async () => {
    const controllerRefTestModule: TestingModule = await Test.createTestingModule({
      controllers: [OrderControllerV1],
      providers: [
        { provide: ORDER_SOLICITATION_SERVICE, useClass: OrderSolicitationService },
        { provide: ORDER_PROCESSOR_SERVICE, useClass: OrderProcessorService },
        { provide: PRODUCT_REPOSITORY, useValue: () => Promise.resolve() },
        { provide: COUPON_REPOSITORY, useValue: () => Promise.resolve() },
        { provide: ORDER_REPOSITORY, useValue: () => Promise.resolve() },
        { provide: FREIGHT_SERVICE, useClass: FreightService },
      ],
    }).compile();

    orderController = await controllerRefTestModule.resolve(OrderControllerV1);
    orderSolicitationService = await controllerRefTestModule.resolve(ORDER_SOLICITATION_SERVICE);
    orderProcessorService = await controllerRefTestModule.resolve(ORDER_PROCESSOR_SERVICE);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('solicitationPreview', () => {
    it('should calculate total order amount', async () => {
      const calculatePreviewMock = jest
        .spyOn(orderSolicitationService, 'calculatePreview')
        .mockImplementation(() => Promise.resolve(new OrderSolicitationPreviewPayloadOutput(100, 10)));
      await orderController.solicitationPreview(new OrderSolicitationPreviewPayloadInput([]));
      expect(calculatePreviewMock).toBeCalledTimes(1);
    });
  });
  describe('register', () => {
    it('should register an order', async () => {
      const registerMock = jest
        .spyOn(orderProcessorService, 'register')
        .mockImplementation(() => Promise.resolve(new OrderProcessorOutput('100')));
      await orderController.register(new OrderSolicitationPreviewPayloadInput([]));
      expect(registerMock).toBeCalledTimes(1);
    });
  });
});
