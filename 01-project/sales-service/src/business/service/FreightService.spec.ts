import { Test, TestingModule } from '@nestjs/testing';
import { PRODUCT_DATABASE } from '../../adapters/storage/data/ProductDatabaseInterface';
import { OrderItemInput } from '../entities/dto/OrderItemInput';
import { Measurements } from '../entities/Measurements';
import OrderItem from '../entities/OrderItem';
import Product from '../entities/Product';
import { ProductRepository } from '../repository/ProductRepository';
import { ProductRepositoryInterface, PRODUCT_REPOSITORY } from '../repository/ProductRepositoryInterface';
import { FreightService } from './FreightService';
import { FreightServiceInterface, FREIGHT_SERVICE } from './FreightServiceInterface';
import { OrderItemService } from './OrderItemService';
import { OrderItemServiceInterface, ORDER_ITEM_SERVICE } from './OrderItemServiceInterface';

describe('Service:FreightService', () => {
  let freightService: FreightServiceInterface;
  let orderItemService: OrderItemServiceInterface;
  let productRepository: ProductRepositoryInterface;

  beforeEach(async () => {
    const serviceRefTestModule: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: FREIGHT_SERVICE, useClass: FreightService },
        { provide: ORDER_ITEM_SERVICE, useClass: OrderItemService },
        { provide: PRODUCT_DATABASE, useValue: () => Promise.resolve() },
        { provide: PRODUCT_REPOSITORY, useClass: ProductRepository },
      ],
    }).compile();
    freightService = await serviceRefTestModule.resolve(FREIGHT_SERVICE);
    orderItemService = await serviceRefTestModule.resolve(ORDER_ITEM_SERVICE);
    productRepository = await serviceRefTestModule.resolve(PRODUCT_REPOSITORY);
  });

  it('should calculate freight cost by order item', () => {
    const measurements = new Measurements(20, 15, 10, 1);
    const product = new Product('ID1', 'A', 15, measurements);
    const orderItem = new OrderItem(product, 2);
    const freight = freightService.getCalculationFromOrderItem(orderItem, 1000);
    expect(freight.getCost()).toEqual(20);
  });
  it('should calculate freight cost by order item list', () => {
    const measurements = new Measurements(20, 15, 10, 1);
    const product = new Product('ID1', 'A', 15, measurements);
    const orderItems = new Array<OrderItem>(
      new OrderItem(product, 2),
      new OrderItem(product, 1),
      new OrderItem(product, 3),
    );
    const freight = freightService.getCalculationFromOrderItems(orderItems, 1000);
    expect(freight.getCost()).toEqual(60);
  });
  it('should calculate freight cost by input of order item list', async () => {
    const p1 = new Product('ID1', 'A', 109, new Measurements(20, 15, 10, 1));
    const p2 = new Product('ID2', 'B', 229.9, new Measurements(30, 50, 60, 2.1));
    const p3 = new Product('ID3', 'C', 1099.9, new Measurements(100, 200, 110, 32));
    const orderItemsInput = new Array<OrderItemInput>(
      new OrderItemInput('ID1', 1),
      new OrderItemInput('ID2', 1),
      new OrderItemInput('ID3', 1),
    );
    const orderItemServiceMock = jest.spyOn(orderItemService, 'getOrderItemsWithProducts');
    const productRepositoryMock = jest
      .spyOn(productRepository, 'findByIds')
      .mockResolvedValue(new Array<Product>(p1, p2, p3));
    const result = await freightService.calculateByProducts(orderItemsInput, 1000);
    expect(result.freightCost).toEqual(351);
    expect(orderItemServiceMock).toBeCalledTimes(1);
    expect(productRepositoryMock).toBeCalledTimes(1);
  });
});
