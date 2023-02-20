import { TestingModule, Test } from '@nestjs/testing';
import { ORDER_DATABASE } from '../../../adapters/storage/data/OrderDatabaseInterface';
import { OrderRepository } from '../../repository/OrderRepository';
import { ORDER_REPOSITORY, OrderRepositoryInterface } from '../../repository/OrderRepositoryInterface';
import OrderRepresentation from '../../entities/OrderRepresentation';
import { ListUserOrders } from './ListUserOrders';
import { ListUserOrdersInput } from '../../entities/dto/ListUserOrdersInput';

describe('UseCase:ListUserOrders', () => {
  let listUserOrders: ListUserOrders;
  let orderRepository: OrderRepositoryInterface;

  beforeEach(async () => {
    const usecaseRefTestModule: TestingModule = await Test.createTestingModule({
      providers: [
        ListUserOrders,
        { provide: ORDER_DATABASE, useValue: () => Promise.resolve() },
        { provide: ORDER_REPOSITORY, useClass: OrderRepository },
      ],
    }).compile();
    listUserOrders = await usecaseRefTestModule.resolve(ListUserOrders);
    orderRepository = await usecaseRefTestModule.resolve(ORDER_REPOSITORY);
  });

  it('should get an order list by cpf', async () => {
    const cpf = '11122233344';
    const input = new ListUserOrdersInput(cpf);
    const orderRepresentationMock = new Array<OrderRepresentation>(
      new OrderRepresentation('internalId', '202311112222', new Date(), '11122233344', 349.99, 23.9, 'VALE15'),
    );
    const orderRepositoryMock = jest.spyOn(orderRepository, 'findByCpf').mockResolvedValue(orderRepresentationMock);
    const result = await listUserOrders.execute(input);
    expect(result).toHaveProperty('orders');
    expect(result).toMatchObject({
      orders: [
        {
          serialCode: orderRepresentationMock[0].serialCode,
          coupon: orderRepresentationMock[0].couponCode,
          total: orderRepresentationMock[0].totalAmount,
          freight: orderRepresentationMock[0].freightPrice,
          createdAt: orderRepresentationMock[0].createdAt,
        },
      ],
    });
    expect(orderRepositoryMock).toBeCalledTimes(1);
    expect(orderRepositoryMock).toBeCalledWith(cpf);
  });

  it('should get an empty order list of unknown cpf', async () => {
    const cpf = '11122233344';
    const input = new ListUserOrdersInput(cpf);
    const orderRepositoryMock = jest.spyOn(orderRepository, 'findByCpf').mockResolvedValue(null);
    const result = await listUserOrders.execute(input);
    expect(result).toHaveProperty('orders');
    expect(result.orders).toStrictEqual([]);
    expect(orderRepositoryMock).toBeCalledTimes(1);
    expect(orderRepositoryMock).toBeCalledWith(cpf);
  });
});
