import { Test, TestingModule } from '@nestjs/testing';
import { CheckoutOrderSolicitation } from './CheckoutOrderSolicitation';
import OrderRepresentation from '../../entities/OrderRepresentation';
import { ORDER_DATABASE, OrderDatabaseInterface } from '../../../adapters/storage/data/OrderDatabaseInterface';
import { OrderRepository } from '../../repository/OrderRepository';
import { OrderRepositoryInterface, ORDER_REPOSITORY } from '../../repository/OrderRepositoryInterface';
import {
  GENERATE_ORDER_SOLICITATION,
  GenerateOrderSolicitationInterface,
} from '../order/GenerateOrderSolicitationInterace';
import OrderSolicitation from '../../entities/OrderSolicitation';
import { OrderSolicitationInput } from '../../entities/dto/OrderSolicitationInput';

describe('UseCase:CheckoutOrderSolicitation', () => {
  let checkoutOrderSolicitation: CheckoutOrderSolicitation;
  let generateOrderSolicitation: GenerateOrderSolicitationInterface;
  let orderRepository: OrderRepositoryInterface;
  let orderDatabase: OrderDatabaseInterface;

  beforeEach(async () => {
    const useCaseRefTestModule: TestingModule = await Test.createTestingModule({
      providers: [
        CheckoutOrderSolicitation,
        { provide: ORDER_REPOSITORY, useClass: OrderRepository },
        { provide: ORDER_DATABASE, useValue: { register: () => Promise.resolve() } },
        { provide: GENERATE_ORDER_SOLICITATION, useValue: { execute: () => Promise.resolve() } },
      ],
    }).compile();

    checkoutOrderSolicitation = await useCaseRefTestModule.resolve(CheckoutOrderSolicitation);
    generateOrderSolicitation = await useCaseRefTestModule.resolve(GENERATE_ORDER_SOLICITATION);
    orderRepository = await useCaseRefTestModule.resolve(ORDER_REPOSITORY);
    orderDatabase = await useCaseRefTestModule.resolve(ORDER_DATABASE);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should register order and generate an identifier order code', async () => {
    const items = [];
    const couponCode = 'VALE30';
    const orderSolicitationInput = new OrderSolicitationInput(items, couponCode);
    const orderSolicitationServiceGenerateSpy = jest
      .spyOn(generateOrderSolicitation, 'execute')
      .mockResolvedValue(new OrderSolicitation('cpf'));
    const orderRepositoryMock = jest.spyOn(orderRepository, 'create');
    const orderDatabaseMock = jest
      .spyOn(orderDatabase, 'register')
      .mockResolvedValue({ id: 'ID1', serial_code: '202300000001' });
    const result = await checkoutOrderSolicitation.execute(orderSolicitationInput);
    expect(orderSolicitationServiceGenerateSpy).toBeCalledTimes(1);
    expect(orderRepositoryMock).toBeCalledTimes(1);
    expect(orderDatabaseMock).toBeCalledTimes(1);
    expect(result.serialCode).toBe('202300000001');
  });
});
