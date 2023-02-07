import { Test, TestingModule } from '@nestjs/testing';
import { Measurements } from '../entities/Measurements';
import OrderItem from '../entities/OrderItem';
import Product from '../entities/Product';
import { FreightService } from './FreightService';
import { FreightServiceInterface, FREIGHT_SERVICE } from './FreightServiceInterface';

describe('Service:FreightService', () => {
  let freightService: FreightServiceInterface;

  beforeEach(async () => {
    const serviceRefTestModule: TestingModule = await Test.createTestingModule({
      providers: [{ provide: FREIGHT_SERVICE, useClass: FreightService }],
    }).compile();
    freightService = await serviceRefTestModule.resolve(FREIGHT_SERVICE);
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
});
