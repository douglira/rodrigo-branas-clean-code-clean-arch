import { Test, TestingModule } from '@nestjs/testing';
import { PRODUCT_DATABASE } from '../../adapters/storage/data/ProductDatabaseInterface';
import { OrderItemInput } from '../entities/dto/OrderItemInput';
import OrderItem from '../entities/OrderItem';
import Product from '../entities/Product';
import { ProductRepository } from '../repository/ProductRepository';
import { ProductRepositoryInterface, PRODUCT_REPOSITORY } from '../repository/ProductRepositoryInterface';
import { OrderItemService } from './OrderItemService';
import { OrderItemServiceInterface, ORDER_ITEM_SERVICE } from './OrderItemServiceInterface';

describe('Service:OrderItemService', () => {
  let orderItemService: OrderItemServiceInterface;
  let productRepository: ProductRepositoryInterface;

  beforeEach(async () => {
    const serviceRefTestModule: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: ORDER_ITEM_SERVICE, useClass: OrderItemService },
        { provide: PRODUCT_REPOSITORY, useClass: ProductRepository },
        { provide: PRODUCT_DATABASE, useValue: () => Promise.resolve() },
      ],
    }).compile();
    orderItemService = await serviceRefTestModule.resolve(ORDER_ITEM_SERVICE);
    productRepository = await serviceRefTestModule.resolve(PRODUCT_REPOSITORY);
  });

  it('should get order items populated by simple input', async () => {
    const input = new Array<OrderItemInput>(
      new OrderItemInput('ID1', 1),
      new OrderItemInput('ID2', 1),
      new OrderItemInput('ID3', 1),
    );
    const productRepositoryMock = jest
      .spyOn(productRepository, 'findByIds')
      .mockResolvedValue(new Array<Product>(new Product('ID1', 'A'), new Product('ID2', 'B'), new Product('ID3', 'C')));
    const items = await orderItemService.getOrderItemsWithProducts(input);
    expect(productRepositoryMock).toBeCalledTimes(1);
    expect(items.length).toEqual(3);
    expect(items).toBeInstanceOf(Array<OrderItem>);
  });
});
