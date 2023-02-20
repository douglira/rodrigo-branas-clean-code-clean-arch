import { Test, TestingModule } from '@nestjs/testing';
import { PRODUCT_DATABASE } from '../../../adapters/storage/data/ProductDatabaseInterface';
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

  it('should calculate freight cost by input of order item list', async () => {
    const input = new FreightCalculatorInput();
    input.items = [
      { product: { id: 'ID1', width: 20, height: 15, depth: 10, weight: 0.6 }, quantity: 1 },
      { product: { id: 'ID2', width: 30, height: 50, depth: 60, weight: 0.8 }, quantity: 1 },
      { product: { id: 'ID3', width: 15, height: 20, depth: 11, weight: 0.4 }, quantity: 1 },
    ];
    const storeRepositoryMock = jest
      .spyOn(storeRepository, 'getNearby')
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
    const result = await simulateFreight.execute(input);
    expect(result.freightCost).toEqual(94225.47);
    expect(storeRepositoryMock).toBeCalledTimes(1);
    expect(geocodingGatewayMock).toBeCalledTimes(1);
  });
});
