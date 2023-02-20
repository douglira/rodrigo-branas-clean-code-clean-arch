import { Test, TestingModule } from '@nestjs/testing';
import { COUPON_REPOSITORY } from '../../../../business/repository/CouponRepositoryInterface';
import { PRODUCT_REPOSITORY } from '../../../../business/repository/ProductRepositoryInterface';
import {
  OrderSolicitationPreviewPayloadInput,
  OrderSolicitationPreviewPayloadOutput,
} from '../../../../business/entities/dto/OrderSolicitationPreviewPayload';
import { OrderControllerV1 } from './order.controller';
import { ORDER_REPOSITORY } from '../../../../business/repository/OrderRepositoryInterface';
import { OrderProcessorOutput } from '../../../../business/entities/dto/OrderProcessorRegisterPayload';
import {
  CHECKOUT_ORDER_SOLICITATION,
  CheckoutOrderSolicitationInterface,
} from '../../../../business/usecase/checkout/CheckoutOrderSolicitationInterface';
import { CheckoutOrderSolicitation } from '../../../../business/usecase/checkout/CheckoutOrderSolicitation';
import { GetOrder } from '../../../../business/usecase/order/GetOrder';
import { GET_ORDER } from '../../../../business/usecase/order/GetOrderInterface';

describe('Controller:OrderV1', () => {
  let orderController: OrderControllerV1;
  let checkoutOrderSolicitation: CheckoutOrderSolicitationInterface;

  beforeEach(async () => {
    const controllerRefTestModule: TestingModule = await Test.createTestingModule({
      controllers: [OrderControllerV1],
      providers: [
        { provide: CHECKOUT_ORDER_SOLICITATION, useClass: CheckoutOrderSolicitation },
        { provide: GET_ORDER, useClass: GetOrder },
        { provide: PRODUCT_REPOSITORY, useValue: () => Promise.resolve() },
        { provide: COUPON_REPOSITORY, useValue: () => Promise.resolve() },
        { provide: ORDER_REPOSITORY, useValue: () => Promise.resolve() },
      ],
    }).compile();

    orderController = await controllerRefTestModule.resolve(OrderControllerV1);
    checkoutOrderSolicitation = await controllerRefTestModule.resolve(CHECKOUT_ORDER_SOLICITATION);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('solicitationPreview', () => {
    it('should calculate total order amount', async () => {
      const calculatePreviewMock = jest
        .spyOn(checkoutOrderSolicitation, 'preview')
        .mockImplementation(() => Promise.resolve(new OrderSolicitationPreviewPayloadOutput(100, 10)));
      await orderController.preview(new OrderSolicitationPreviewPayloadInput([]));
      expect(calculatePreviewMock).toBeCalledTimes(1);
    });
  });
  describe('register', () => {
    it('should register an order', async () => {
      const registerMock = jest
        .spyOn(checkoutOrderSolicitation, 'execute')
        .mockImplementation(() => Promise.resolve(new OrderProcessorOutput('100')));
      await orderController.checkout(new OrderSolicitationPreviewPayloadInput([]));
      expect(registerMock).toBeCalledTimes(1);
    });
  });
});
