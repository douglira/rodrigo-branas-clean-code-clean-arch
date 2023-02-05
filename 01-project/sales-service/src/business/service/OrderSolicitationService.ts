import { Inject, Injectable } from '@nestjs/common';
import {
  OrderSolicitationPreviewPayloadRequest,
  OrderSolicitationPreviewPayloadResponse,
} from '../../adapters/http/handlers/order/dto/OrderSolicitationPreviewPayload';
import Coupon from '../model/Coupon';
import OrderItem from '../model/OrderItem';
import { CouponRepositoryInterface, COUPON_REPOSITORY } from '../repository/CouponRepositoryInterface';
import { ProductRepositoryInterface, PRODUCT_REPOSITORY } from '../repository/ProductRepositoryInterface';
import { OrderSolicitationServiceInterface } from './OrderSolicitationServiceInterface';

@Injectable()
export class OrderSolicitationService implements OrderSolicitationServiceInterface {
  constructor(
    @Inject(PRODUCT_REPOSITORY) private readonly productRepository: ProductRepositoryInterface,
    @Inject(COUPON_REPOSITORY) private readonly couponRepository: CouponRepositoryInterface,
  ) {}

  async calculatePreview(
    orderSolicitationPayload: OrderSolicitationPreviewPayloadRequest,
  ): Promise<OrderSolicitationPreviewPayloadResponse> {
    const orderSolicitation = OrderSolicitationPreviewPayloadRequest.build(orderSolicitationPayload);
    const products = await this.productRepository.findByIds(
      orderSolicitation.getItems().map((item: OrderItem) => item.product.id),
    );
    let coupon = new Coupon();
    if (orderSolicitation.hasCouponCode()) {
      coupon = await this.couponRepository.findByName(orderSolicitation.getCoupon().name);
      orderSolicitation.setCoupon(coupon);
    }
    orderSolicitation.calculateFinalTotalAmountByProducts(products);
    return new OrderSolicitationPreviewPayloadResponse(
      orderSolicitation.getFinalTotalAmount(),
      orderSolicitation.getFreightCost(),
    );
  }
}
