import { Test, TestingModule } from '@nestjs/testing';
import OrderItem from '../model/OrderItem';
import Product from '../model/Product';
import OrderSolicitation from '../model/OrderSolicitation';
import { ProductRepositoryInterface, PRODUCT_REPOSITORY } from '../repository/ProductRepositoryInterface';
import { OrderSolicitationService } from './OrderSolicitationService';
import { OrderSolicitationServiceInterface, ORDER_SOLICITATION_SERVICE } from './OrderSolicitationServiceInterface';
import { PRODUCT_DATABASE } from '../../adapters/storage/data/ProductDatabaseInterface';
import { ProductRepository } from '../repository/ProductRepository';

describe('OrderSolicitationService', () => {
  let orderSolicitationService: OrderSolicitationServiceInterface;
  let productRepository: ProductRepositoryInterface;

  beforeEach(async () => {
    const serviceRefTestModule: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: ORDER_SOLICITATION_SERVICE, useClass: OrderSolicitationService },
        { provide: PRODUCT_REPOSITORY, useClass: ProductRepository },
        { provide: PRODUCT_DATABASE, useValue: () => Promise.resolve() },
      ],
    }).compile();

    orderSolicitationService = await serviceRefTestModule.resolve(ORDER_SOLICITATION_SERVICE);
    productRepository = await serviceRefTestModule.resolve(PRODUCT_REPOSITORY);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('calculatePreview', () => {
    it('should calculate final total order amount with 3 order items', async () => {
      const items = new Array<OrderItem>(
        new OrderItem(new Product('ID1'), 3),
        new OrderItem(new Product('ID2'), 1),
        new OrderItem(new Product('ID3'), 1),
      );
      const orderSolicitationInput = new OrderSolicitation(items);
      const productRepositoryMock = jest
        .spyOn(productRepository, 'findByIds')
        .mockImplementation(() =>
          Promise.resolve(
            new Array<Product>(
              new Product('ID1', 'P1', 15),
              new Product('ID2', 'P1', 40),
              new Product('ID3', 'P1', 90),
            ),
          ),
        );
      const result = await orderSolicitationService.calculatePreview(orderSolicitationInput);
      expect(productRepositoryMock).toBeCalledTimes(1);
      expect(result.getFinalTotalAmount()).toBe(175);
    });
    it('should calculate final total order amount with 3 order items and 1 discount coupon', async () => {
      const items = new Array<OrderItem>(
        new OrderItem(new Product('ID1'), 3),
        new OrderItem(new Product('ID2'), 1),
        new OrderItem(new Product('ID3'), 1),
      );
      const orderSolicitationInput = new OrderSolicitation(items, 10);
      const productRepositoryMock = jest
        .spyOn(productRepository, 'findByIds')
        .mockImplementation(() =>
          Promise.resolve(
            new Array<Product>(
              new Product('ID1', 'P1', 15),
              new Product('ID2', 'P1', 40),
              new Product('ID3', 'P1', 90),
            ),
          ),
        );
      const result = await orderSolicitationService.calculatePreview(orderSolicitationInput);
      expect(productRepositoryMock).toBeCalledTimes(1);
      expect(result.getFinalTotalAmount()).toBe(157.5);
    });
  });
});
