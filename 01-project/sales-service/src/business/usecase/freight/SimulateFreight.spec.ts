import { Test, TestingModule } from '@nestjs/testing';
import { PRODUCT_DATABASE } from '../../../adapters/storage/data/ProductDatabaseInterface';
import { OrderItemInput } from '../../entities/dto/OrderItemInput';
import { Measurements } from '../../entities/Measurements';
import OrderItem from '../../entities/OrderItem';
import Product from '../../entities/Product';
import { ProductRepository } from '../../repository/ProductRepository';
import { ProductRepositoryInterface, PRODUCT_REPOSITORY } from '../../repository/ProductRepositoryInterface';
import { SimulateFreight } from './SimulateFreight';
import { FreightCalculatorInput } from '../../entities/dto/FreightCalculatorInput';
import { STORE_REPOSITORY, StoreRepositoryInterface } from '../../repository/StoreRepositoryInterface';
import { GEO_CODING_GATEWAY, GeocodingGateway } from '../../../adapters/gateway/GeocodingGateway';
import { StoreRepository } from '../../repository/StoreRepository';
import { GoogleGeocodingGateway } from '../../../adapters/gateway/GoogleGeocodingGateway';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { Address } from '../../entities/Address';
import { Store } from '../../entities/Store';
import { Coordinates } from '../../entities/Coordinates';
import { STORE_DATABASE } from '../../../adapters/storage/data/StoreDatabaseInterface';

describe('UseCase:SimulateFreight', () => {
  let simulateFreight: SimulateFreight;
  let productRepository: ProductRepositoryInterface;
  let storeRepository: StoreRepositoryInterface;
  let geocodingGateway: GeocodingGateway;

  beforeEach(async () => {
    const usecaseRefTestModule: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule.forRoot({ ignoreEnvFile: true })],
      providers: [
        SimulateFreight,
        { provide: PRODUCT_DATABASE, useValue: () => Promise.resolve() },
        { provide: PRODUCT_REPOSITORY, useClass: ProductRepository },
        { provide: STORE_DATABASE, useValue: () => Promise.resolve() },
        { provide: STORE_REPOSITORY, useClass: StoreRepository },
        { provide: GEO_CODING_GATEWAY, useClass: GoogleGeocodingGateway },
      ],
    }).compile();
    simulateFreight = await usecaseRefTestModule.resolve(SimulateFreight);
    productRepository = await usecaseRefTestModule.resolve(PRODUCT_REPOSITORY);
    storeRepository = await usecaseRefTestModule.resolve(STORE_REPOSITORY);
    geocodingGateway = await usecaseRefTestModule.resolve(GEO_CODING_GATEWAY);
  });

  it('should calculate freight cost by order item', () => {
    const measurements = new Measurements(20, 15, 10, 1);
    const product = new Product('ID1', 'A', 15, measurements);
    const orderItem = new OrderItem(product, 2);
    const freight = simulateFreight.getCalculationFromOrderItem(orderItem, 1000);
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
    const freight = simulateFreight.getCalculationFromOrderItems(orderItems, 1000);
    expect(freight.getCost()).toEqual(60);
  });
  it('should calculate freight cost by input of order item list', async () => {
    const p1 = new Product('ID1', 'A', 109, new Measurements(20, 15, 10, 0.6));
    const p2 = new Product('ID2', 'B', 229.9, new Measurements(30, 50, 60, 0.8));
    const p3 = new Product('ID3', 'C', 1099.9, new Measurements(15, 20, 11, 0.4));
    const input = new FreightCalculatorInput();
    input.items = new Array<OrderItemInput>(
      new OrderItemInput('ID1', 1),
      new OrderItemInput('ID2', 1),
      new OrderItemInput('ID3', 1),
    );
    const storeRepositoryMock = jest
      .spyOn(storeRepository, 'get')
      .mockResolvedValue(
        new Store(
          'ID1',
          'A',
          new Address(
            'ID1',
            '08999000',
            'street',
            'streeNumber',
            'country',
            'city',
            'neighborhood',
            'province',
            'additionalData',
            new Coordinates(-23.536864, -46.203654),
          ),
        ),
      );
    const geocodingGatewayMock = jest
      .spyOn(geocodingGateway, 'getLatLgnByPostalCode')
      .mockResolvedValue(new Coordinates(23.542634, -46.203938));
    const productRepositoryMock = jest
      .spyOn(productRepository, 'findByIds')
      .mockResolvedValue(new Array<Product>(p1, p2, p3));
    const result = await simulateFreight.execute(input);
    expect(result.freightCost).toEqual(94225.47);
    expect(productRepositoryMock).toBeCalledTimes(1);
    expect(storeRepositoryMock).toBeCalledTimes(1);
    expect(geocodingGatewayMock).toBeCalledTimes(1);
  });
});
