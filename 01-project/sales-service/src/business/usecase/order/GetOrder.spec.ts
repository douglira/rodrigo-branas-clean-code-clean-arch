import { TestingModule, Test } from '@nestjs/testing';
import { ORDER_DATABASE } from '../../../adapters/storage/data/OrderDatabaseInterface';
import { OrderRepository } from '../../repository/OrderRepository';
import { ORDER_REPOSITORY, OrderRepositoryInterface } from '../../repository/OrderRepositoryInterface';
import OrderRepresentation from '../../entities/OrderRepresentation';
import { GetOrderInput } from '../../entities/dto/GetOrderInput';
import { GetOrder } from './GetOrder';
import OrderItem from '../../entities/OrderItem';
import Product from '../../entities/Product';
import {
  OrderRepresentationException,
  OrderRepresentationExceptionType,
} from '../../exceptions/OrderRepresentationException';

describe('UseCase:GetOrder', () => {
  let getOrder: GetOrder;
  let orderRepository: OrderRepositoryInterface;

  beforeEach(async () => {
    const usecaseRefTestModule: TestingModule = await Test.createTestingModule({
      providers: [
        GetOrder,
        { provide: ORDER_DATABASE, useValue: () => Promise.resolve() },
        { provide: ORDER_REPOSITORY, useClass: OrderRepository },
      ],
    }).compile();
    getOrder = await usecaseRefTestModule.resolve(GetOrder);
    orderRepository = await usecaseRefTestModule.resolve(ORDER_REPOSITORY);
  });

  it('should get order by serial code', async () => {
    const input = new GetOrderInput('202311112222');
    const item = new OrderItem(new Product('PID1', 'A'), 1);
    item.soldPrice = 326.09;
    const items = new Array<OrderItem>(item);
    const orderRepresentationMock = new OrderRepresentation(
      'internalId',
      input.serialCode,
      new Date(),
      '11122233344',
      349.99,
      23.9,
      'VALE15',
      items,
    );
    const orderRepositoryMock = jest
      .spyOn(orderRepository, 'getBySerialCode')
      .mockResolvedValue(orderRepresentationMock);
    const result = await getOrder.execute(input);
    expect(result.total).toEqual(orderRepresentationMock.totalAmount);
    expect(result.freight).toEqual(orderRepresentationMock.freightPrice);
    expect(result.coupon).toEqual(orderRepresentationMock.couponCode);
    expect(result.serialCode).toEqual(orderRepresentationMock.serialCode);
    expect(result.createdAt).toEqual(orderRepresentationMock.createdAt);
    expect(result.items).toEqual(items);
    expect(orderRepositoryMock).toBeCalledTimes(1);
    expect(orderRepositoryMock).toBeCalledWith(input.serialCode);
  });

  it('should return not found exepction for unknown serial code', async () => {
    const input = new GetOrderInput('202311112222');
    const orderRepositoryMock = jest.spyOn(orderRepository, 'getBySerialCode').mockResolvedValue(null);
    const rejectedPromiseResult = getOrder.execute(input);
    await expect(rejectedPromiseResult).rejects.toThrow(OrderRepresentationException);
    await expect(rejectedPromiseResult).rejects.toThrow(OrderRepresentationExceptionType.NOT_FOUND_DATABASE.toString());
    expect(orderRepositoryMock).toBeCalledTimes(1);
    expect(orderRepositoryMock).toBeCalledWith(input.serialCode);
  });
});
