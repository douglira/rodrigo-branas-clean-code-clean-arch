import { Inject, Injectable } from '@nestjs/common';
import {
  OrderSolicitationPreviewPayloadInput,
  OrderSolicitationPreviewPayloadOutput,
} from '../entities/dto/OrderSolicitationPreviewPayload';
import Coupon from '../entities/Coupon';
import OrderSolicitation from '../entities/OrderSolicitation';
import { CouponRepositoryInterface, COUPON_REPOSITORY } from '../repository/CouponRepositoryInterface';
import { FreightServiceInterface, FREIGHT_SERVICE } from './FreightServiceInterface';
import { OrderSolicitationServiceInterface } from './OrderSolicitationServiceInterface';
import { OrderItemServiceInterface, ORDER_ITEM_SERVICE } from './OrderItemServiceInterface';

@Injectable()
export class OrderSolicitationService implements OrderSolicitationServiceInterface {
  constructor(
    @Inject(ORDER_ITEM_SERVICE) private readonly orderItemService: OrderItemServiceInterface,
    @Inject(COUPON_REPOSITORY) private readonly couponRepository: CouponRepositoryInterface,
    @Inject(FREIGHT_SERVICE) private readonly freightService: FreightServiceInterface,
  ) {}

  async getCoupon(orderSolicitationPayload: OrderSolicitationPreviewPayloadInput): Promise<Coupon> {
    if (!!orderSolicitationPayload.coupon) {
      return this.couponRepository.findByName(orderSolicitationPayload.coupon);
    }
    new Coupon();
  }

  async generate(orderSolicitationPayload: OrderSolicitationPreviewPayloadInput): Promise<OrderSolicitation> {
    const [orderItems, coupon] = await Promise.all([
      this.orderItemService.getOrderItemsWithProducts(orderSolicitationPayload.orderItems),
      this.getCoupon(orderSolicitationPayload),
    ]);
    const orderSolicitation = new OrderSolicitation(
      orderItems,
      coupon,
      this.freightService.getCalculationFromOrderItems(orderItems, 1000),
    );
    orderSolicitation.setCpf(orderSolicitationPayload.cpf);
    orderSolicitation.calculateFinalTotalAmount();
    return orderSolicitation;
  }

  async calculatePreview(
    orderSolicitationPayload: OrderSolicitationPreviewPayloadInput,
  ): Promise<OrderSolicitationPreviewPayloadOutput> {
    const orderSolicitation = await this.generate(orderSolicitationPayload);
    return new OrderSolicitationPreviewPayloadOutput(
      orderSolicitation.getFinalTotalAmount(),
      orderSolicitation.getFreightCost(),
    );
  }
}
