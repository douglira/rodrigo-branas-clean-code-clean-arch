import { Test, TestingModule } from '@nestjs/testing';
import { OrderSolicitationInput } from '../../entities/dto/OrderSolicitationInput';
import { COUPON_REPOSITORY, CouponRepositoryInterface } from '../../repository/CouponRepositoryInterface';
import { CouponRepository } from '../../repository/CouponRepository';
import { PRODUCT_REPOSITORY, ProductRepositoryInterface } from '../../repository/ProductRepositoryInterface';
import { ProductRepository } from '../../repository/ProductRepository';
import { SIMULATE_FREIGHT, SimulateFreightInterface } from '../freight/SimulateFreightInterface';
import { COUPON_DATABASE, CouponDatabaseInterface } from '../../../adapters/storage/data/CouponDatabaseInterface';
import { PRODUCT_DATABASE, ProductDatabaseInterface } from '../../../adapters/storage/data/ProductDatabaseInterface';
import { GenerateOrderSolicitation } from './GenerateOrderSolicitation';
import { FreightCalculatorOutput } from '../../entities/dto/FreightCalculatorOutput';
import { CouponException, CouponExceptionType } from '../../exceptions/CouponException';
import {
  OrderSolicitationException,
  OrderSolicitationExceptionType,
} from '../../exceptions/OrderSolicitationException';

describe('UseCase:GenerateOrderSolicitation', () => {
  let generateOrderSolicitation: GenerateOrderSolicitation;
  let couponRepository: CouponRepositoryInterface;
  let productRepository: ProductRepositoryInterface;
  let couponDatabase: CouponDatabaseInterface;
  let productDatabase: ProductDatabaseInterface;
  let simulateFreight: SimulateFreightInterface;

  beforeEach(async () => {
    const useCaseRefTestModule: TestingModule = await Test.createTestingModule({
      providers: [
        GenerateOrderSolicitation,
        { provide: COUPON_REPOSITORY, useClass: CouponRepository },
        { provide: PRODUCT_REPOSITORY, useClass: ProductRepository },
        { provide: COUPON_DATABASE, useValue: { findByName: () => Promise.resolve() } },
        { provide: PRODUCT_DATABASE, useValue: { findByIds: () => Promise.resolve() } },
        { provide: SIMULATE_FREIGHT, useValue: { execute: () => Promise.resolve() } },
      ],
    }).compile();

    generateOrderSolicitation = await useCaseRefTestModule.resolve(GenerateOrderSolicitation);
    couponRepository = await useCaseRefTestModule.resolve(COUPON_REPOSITORY);
    productRepository = await useCaseRefTestModule.resolve(PRODUCT_REPOSITORY);
    couponDatabase = await useCaseRefTestModule.resolve(COUPON_DATABASE);
    productDatabase = await useCaseRefTestModule.resolve(PRODUCT_DATABASE);
    simulateFreight = await useCaseRefTestModule.resolve(SIMULATE_FREIGHT);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should calculate final total order amount with 3 order items and freight without coupon', async () => {
    const orderSolicitationInput = new OrderSolicitationInput([
      { productId: 'ID1', quantity: 3 },
      { productId: 'ID2', quantity: 1 },
      { productId: 'ID3', quantity: 1 },
    ]);
    orderSolicitationInput.addresseePostalCode = '08790900';
    const productRepositoryMock = jest.spyOn(productRepository, 'findByIds');
    const productDatabaseMock = jest.spyOn(productDatabase, 'findByIds').mockResolvedValue([
      { id: 'ID1', title: 'P1', base_price: 15, width: 10, height: 15, depth: 20, weight: 2 },
      { id: 'ID2', title: 'P2', base_price: 40, width: 30, height: 40, depth: 60, weight: 2.5 },
      { id: 'ID3', title: 'P3', base_price: 90, width: 80, height: 120, depth: 220, weight: 10 },
    ]);
    const couponRepositoryMock = jest.spyOn(couponRepository, 'findByName');
    const simulateFreightMock = jest
      .spyOn(simulateFreight, 'execute')
      .mockResolvedValue(new FreightCalculatorOutput(14.9));
    const result = await generateOrderSolicitation.execute(orderSolicitationInput);
    expect(productRepositoryMock).toBeCalledTimes(1);
    expect(productDatabaseMock).toBeCalledTimes(1);
    expect(simulateFreightMock).toBeCalledTimes(1);
    expect(couponRepositoryMock).not.toBeCalled();
    expect(simulateFreightMock).toBeCalledWith({
      addresseePostalCode: '08790900',
      items: [
        { quantity: 3, product: { id: 'ID1', width: 10, height: 15, depth: 20, weight: 2 } },
        { quantity: 1, product: { id: 'ID2', width: 30, height: 40, depth: 60, weight: 2.5 } },
        { quantity: 1, product: { id: 'ID3', width: 80, height: 120, depth: 220, weight: 10 } },
      ],
    });
    expect(result.getTotal()).toBe(189.9);
    expect(result.getFreight()).toBe(14.9);
  });

  it('should calculate final total order amount with 4 order items, 1 discount coupon and freight', async () => {
    const orderSolicitationInput = new OrderSolicitationInput([
      { productId: 'ID1', quantity: 3 },
      { productId: 'ID2', quantity: 1 },
      { productId: 'ID3', quantity: 1 },
      { productId: 'ID4', quantity: 1 },
    ]);
    orderSolicitationInput.addresseePostalCode = '08790900';
    orderSolicitationInput.coupon = 'VALE30';
    const productRepositoryMock = jest.spyOn(productRepository, 'findByIds');
    const productDatabaseMock = jest.spyOn(productDatabase, 'findByIds').mockResolvedValue([
      { id: 'ID1', title: 'P1', base_price: 15, width: 10, height: 15, depth: 20, weight: 2 },
      { id: 'ID2', title: 'P2', base_price: 40, width: 30, height: 40, depth: 60, weight: 2.5 },
      { id: 'ID3', title: 'P3', base_price: 20, width: 80, height: 120, depth: 220, weight: 10 },
      { id: 'ID4', title: 'P4', base_price: 70, width: 220, height: 300, depth: 430, weight: 16 },
    ]);
    const couponRepositotyMock = jest.spyOn(couponRepository, 'findByName');
    const couponDatabaseMock = jest
      .spyOn(couponDatabase, 'findByName')
      .mockResolvedValue([{ id: 'ID1', name: 'VALE30', discount: 30, expires_in: new Date(Date.now() + 100000000) }]);
    const simulateFreightMock = jest
      .spyOn(simulateFreight, 'execute')
      .mockResolvedValue(new FreightCalculatorOutput(344.99));
    const result = await generateOrderSolicitation.execute(orderSolicitationInput);
    expect(productRepositoryMock).toBeCalledTimes(1);
    expect(couponRepositotyMock).toBeCalledTimes(1);
    expect(couponRepositotyMock).toBeCalledWith('VALE30');
    expect(productDatabaseMock).toBeCalledTimes(1);
    expect(couponDatabaseMock).toBeCalledTimes(1);
    expect(simulateFreightMock).toBeCalledTimes(1);
    expect(result.getTotal()).toBe(467.49);
    expect(result.getFreight()).toBe(344.99);
  });

  it('should error when calculate final total order amount for expired discount', async () => {
    const orderSolicitationInput = new OrderSolicitationInput([
      { productId: 'ID1', quantity: 3 },
      { productId: 'ID2', quantity: 1 },
      { productId: 'ID3', quantity: 1 },
    ]);
    orderSolicitationInput.coupon = 'VALE30';
    orderSolicitationInput.addresseePostalCode = '08790900';
    const productRepositoryMock = jest.spyOn(productRepository, 'findByIds');
    const productDatabaseMock = jest.spyOn(productDatabase, 'findByIds').mockResolvedValue([
      { id: 'ID1', title: 'P1', base_price: 15, width: 10, height: 15, depth: 20, weight: 2 },
      { id: 'ID2', title: 'P2', base_price: 40, width: 30, height: 40, depth: 60, weight: 2.5 },
      { id: 'ID3', title: 'P3', base_price: 90, width: 80, height: 120, depth: 220, weight: 10 },
    ]);
    const couponRepositoryMock = jest.spyOn(couponRepository, 'findByName');
    const couponDatabaseMock = jest
      .spyOn(couponDatabase, 'findByName')
      .mockResolvedValue([{ id: 'ID1', name: 'VALE30', discount: 30, expires_in: new Date(Date.now() - 100000000) }]);
    const simulateFreightMock = jest
      .spyOn(simulateFreight, 'execute')
      .mockResolvedValue(new FreightCalculatorOutput(14.9));
    const rejectedPromise = generateOrderSolicitation.execute(orderSolicitationInput);
    await expect(rejectedPromise).rejects.toThrow(CouponException);
    await expect(rejectedPromise).rejects.toThrow(CouponExceptionType.COUPON_EXPIRED.toString());
    expect(productRepositoryMock).not.toBeCalled();
    expect(productDatabaseMock).not.toBeCalled();
    expect(simulateFreightMock).not.toBeCalled();
    expect(simulateFreightMock).not.toBeCalled();
    expect(couponDatabaseMock).toBeCalledTimes(1);
    expect(couponRepositoryMock).toBeCalledTimes(1);
  });

  it('should error when calculate final total order amount for repeated order item products', async () => {
    const orderSolicitationInput = new OrderSolicitationInput([
      { productId: 'ID1', quantity: 3 },
      { productId: 'ID1', quantity: 1 },
      { productId: 'ID3', quantity: 1 },
    ]);
    orderSolicitationInput.addresseePostalCode = '08790900';
    const productRepositoryMock = jest.spyOn(productRepository, 'findByIds');
    const productDatabaseMock = jest.spyOn(productDatabase, 'findByIds');
    const simulateFreightMock = jest.spyOn(simulateFreight, 'execute');
    const rejectedPromise = generateOrderSolicitation.execute(orderSolicitationInput);
    await expect(rejectedPromise).rejects.toThrow(OrderSolicitationException);
    await expect(rejectedPromise).rejects.toThrow(OrderSolicitationExceptionType.DUPLICATED_PRODUCT.toString());
    expect(productRepositoryMock).not.toBeCalled();
    expect(productDatabaseMock).not.toBeCalled();
    expect(simulateFreightMock).not.toBeCalled();
    expect(simulateFreightMock).not.toBeCalled();
  });

  it('should error for empty postal code input', async () => {
    const orderSolicitationInput = new OrderSolicitationInput([
      { productId: 'ID1', quantity: 3 },
      { productId: 'ID1', quantity: 1 },
      { productId: 'ID3', quantity: 1 },
    ]);
    const productRepositoryMock = jest.spyOn(productRepository, 'findByIds');
    const productDatabaseMock = jest.spyOn(productDatabase, 'findByIds');
    const simulateFreightMock = jest.spyOn(simulateFreight, 'execute');
    const rejectedPromise = generateOrderSolicitation.execute(orderSolicitationInput);
    await expect(rejectedPromise).rejects.toThrow(OrderSolicitationException);
    await expect(rejectedPromise).rejects.toThrow(OrderSolicitationExceptionType.POSTAL_CODE_INVALID.toString());
    expect(productRepositoryMock).not.toBeCalled();
    expect(productDatabaseMock).not.toBeCalled();
    expect(simulateFreightMock).not.toBeCalled();
  });
});
