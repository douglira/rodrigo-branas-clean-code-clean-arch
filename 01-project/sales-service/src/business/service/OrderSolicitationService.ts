import { Inject, Injectable } from '@nestjs/common';
import {
  OrderSolicitationPreviewPayloadInput,
  OrderSolicitationPreviewPayloadOutput,
} from '../entities/dto/OrderSolicitationPreviewPayload';
import { OrderSolicitationException, OrderSolicitationExceptionType } from '../exceptions/OrderSolicitationException';
import Coupon from '../entities/Coupon';
import OrderItem from '../entities/OrderItem';
import OrderSolicitation from '../entities/OrderSolicitation';
import Product from '../entities/Product';
import { CouponRepositoryInterface, COUPON_REPOSITORY } from '../repository/CouponRepositoryInterface';
import { ProductRepositoryInterface, PRODUCT_REPOSITORY } from '../repository/ProductRepositoryInterface';
import { FreightServiceInterface, FREIGHT_SERVICE } from './FreightServiceInterface';
import { OrderSolicitationServiceInterface } from './OrderSolicitationServiceInterface';

@Injectable()
export class OrderSolicitationService implements OrderSolicitationServiceInterface {
  constructor(
    @Inject(PRODUCT_REPOSITORY) private readonly productRepository: ProductRepositoryInterface,
    @Inject(COUPON_REPOSITORY) private readonly couponRepository: CouponRepositoryInterface,
    @Inject(FREIGHT_SERVICE) private readonly freightService: FreightServiceInterface,
  ) {}
  async getOrderItemsWithProducts(
    orderSolicitationPayload: OrderSolicitationPreviewPayloadInput,
  ): Promise<OrderItem[]> {
    const orderItems = OrderSolicitationPreviewPayloadInput.getOrderItems(orderSolicitationPayload);
    const products = await this.productRepository.findByIds(orderItems.map((item: OrderItem) => item.product.id));
    if (products.length !== orderItems.length)
      throw new OrderSolicitationException({
        type: OrderSolicitationExceptionType.PRODUCTS_LIST_DIFFER_ITEMS_LIST,
      });
    return orderItems.reduce((items: OrderItem[], orderItem: OrderItem) => {
      const product = products.find((product: Product) => product.isEqualById(orderItem.product));
      if (!product)
        throw new OrderSolicitationException({
          type: OrderSolicitationExceptionType.PRODUCT_NOT_FOUND,
        });
      items.push(new OrderItem(product, orderItem.quantity));
      return items;
    }, new Array<OrderItem>());
  }

  async getCoupon(orderSolicitationPayload: OrderSolicitationPreviewPayloadInput): Promise<Coupon> {
    if (!!orderSolicitationPayload.coupon) {
      return this.couponRepository.findByName(orderSolicitationPayload.coupon);
    }
    new Coupon();
  }

  async generate(orderSolicitationPayload: OrderSolicitationPreviewPayloadInput): Promise<OrderSolicitation> {
    const [orderItems, coupon] = await Promise.all([
      this.getOrderItemsWithProducts(orderSolicitationPayload),
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
