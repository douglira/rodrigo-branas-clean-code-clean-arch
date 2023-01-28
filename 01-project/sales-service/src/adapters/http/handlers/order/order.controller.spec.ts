import { Test, TestingModule } from '@nestjs/testing';
import { OrderSolicitationService } from './../../../../business/service/OrderSolicitationService';
import {
  OrderSolicitationServiceInterface,
  ORDER_SOLICITATION_SERVICE,
} from './../../../../business/service/OrderSolicitationService.interface';
import { OrderSolicitationPreviewPayloadRequest } from './dto/OrderSolicitationPreviewPayload';
import { OrderControllerV1 } from './order.controller';

describe('OrderControllerV1', () => {
  let orderController: OrderControllerV1;
  let orderSolicitationService: OrderSolicitationServiceInterface;

  beforeEach(async () => {
    const orderModuleRef: TestingModule = await Test.createTestingModule({
      controllers: [OrderControllerV1],
      providers: [{ provide: ORDER_SOLICITATION_SERVICE, useClass: OrderSolicitationService }],
    }).compile();

    orderController = orderModuleRef.get<OrderControllerV1>(OrderControllerV1);
    orderSolicitationService = await orderModuleRef.resolve(ORDER_SOLICITATION_SERVICE);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('solicitationPreview', () => {
    it('should calculate total order amount', async () => {
      const calculatePreviewMock = jest
        .spyOn(orderSolicitationService, 'calculatePreview')
        .mockImplementation((orderSolicitation) => orderSolicitation);
      await orderController.solicitationPreview(new OrderSolicitationPreviewPayloadRequest([]));
      expect(calculatePreviewMock).toBeCalledTimes(1);
    });
  });
});
