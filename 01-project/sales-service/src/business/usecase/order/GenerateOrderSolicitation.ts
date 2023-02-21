import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { OrderSolicitationInput } from '../../entities/dto/OrderSolicitationInput';
import Coupon from '../../entities/Coupon';
import OrderSolicitation from '../../entities/OrderSolicitation';
import { CouponRepositoryInterface, COUPON_REPOSITORY } from '../../repository/CouponRepositoryInterface';
import { PRODUCT_REPOSITORY, ProductRepositoryInterface } from '../../repository/ProductRepositoryInterface';
import {
  OrderSolicitationException,
  OrderSolicitationExceptionType,
} from '../../exceptions/OrderSolicitationException';
import { SIMULATE_FREIGHT, SimulateFreightInterface } from '../freight/SimulateFreightInterface';
import { FreightCalculatorInput, FreightItemInput } from '../../entities/dto/FreightCalculatorInput';
import { GenerateOrderSolicitationInterface } from './GenerateOrderSolicitationInterace';

@Injectable()
export class GenerateOrderSolicitation implements GenerateOrderSolicitationInterface {
  constructor(
    @Inject(COUPON_REPOSITORY) private readonly couponRepository: CouponRepositoryInterface,
    @Inject(PRODUCT_REPOSITORY) private readonly productRepository: ProductRepositoryInterface,
    @Inject(SIMULATE_FREIGHT) private readonly simulateFreight: SimulateFreightInterface,
  ) {}

  async getCoupon(orderSolicitationPayload: OrderSolicitationInput): Promise<Coupon> {
    if (!!orderSolicitationPayload.coupon) {
      return this.couponRepository.findByName(orderSolicitationPayload.coupon);
    }
    new Coupon();
  }

  async execute(orderSolicitationInput: OrderSolicitationInput): Promise<OrderSolicitation> {
    if (!orderSolicitationInput.addresseePostalCode) {
      throw new OrderSolicitationException({
        type: OrderSolicitationExceptionType.POSTAL_CODE_INVALID,
        httpStatus: HttpStatus.BAD_REQUEST,
      });
    }
    const orderSolicitation = new OrderSolicitation(orderSolicitationInput.cpf);
    const coupon = await this.getCoupon(orderSolicitationInput);
    orderSolicitation.setCoupon(coupon);
    const productIds: string[] = [];
    const freightItems: FreightItemInput[] = [];
    const mapProductIdQuantity = new Map<string, number>();
    for (const itemInput of orderSolicitationInput.orderItems) {
      if (productIds.includes(itemInput.productId)) {
        throw new OrderSolicitationException({
          type: OrderSolicitationExceptionType.DUPLICATED_PRODUCT,
        });
      }
      mapProductIdQuantity.set(itemInput.productId, itemInput.quantity);
      productIds.push(itemInput.productId);
    }
    const products = await this.productRepository.findByIds(productIds);
    for (const product of products) {
      orderSolicitation.addItem(product, mapProductIdQuantity.get(product.id));
      freightItems.push({
        quantity: mapProductIdQuantity.get(product.id),
        width: product.getMeasurements().width,
        height: product.getMeasurements().height,
        depth: product.getMeasurements().depth,
        weight: product.getMeasurements().weight,
      });
    }
    const simulateFreightInput = new FreightCalculatorInput(orderSolicitationInput.addresseePostalCode, freightItems);
    const outputFreightSimulate = await this.simulateFreight.execute(simulateFreightInput);
    orderSolicitation.setFreight(outputFreightSimulate.freightCost);
    return orderSolicitation;
  }
}
