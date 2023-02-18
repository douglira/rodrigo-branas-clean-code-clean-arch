import { Inject, Injectable } from '@nestjs/common';
import {
  OrderSolicitationPreviewPayloadInput,
  OrderSolicitationPreviewPayloadOutput,
} from '../../entities/dto/OrderSolicitationPreviewPayload';
import Coupon from '../../entities/Coupon';
import OrderSolicitation from '../../entities/OrderSolicitation';
import { CouponRepositoryInterface, COUPON_REPOSITORY } from '../../repository/CouponRepositoryInterface';
import Freight from '../../entities/Freight';
import OrderItem from '../../entities/OrderItem';
import { PRODUCT_REPOSITORY, ProductRepositoryInterface } from '../../repository/ProductRepositoryInterface';
import Product from '../../entities/Product';
import {
  OrderSolicitationException,
  OrderSolicitationExceptionType,
} from '../../exceptions/OrderSolicitationException';
import { ORDER_REPOSITORY, OrderRepositoryInterface } from '../../repository/OrderRepositoryInterface';
import { OrderProcessorOutput } from '../../entities/dto/OrderProcessorRegisterPayload';

@Injectable()
export class CheckoutOrderSolicitation {
  constructor(
    @Inject(COUPON_REPOSITORY) private readonly couponRepository: CouponRepositoryInterface,
    @Inject(PRODUCT_REPOSITORY) private readonly productRepository: ProductRepositoryInterface,
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: OrderRepositoryInterface,
  ) {}

  async getCoupon(orderSolicitationPayload: OrderSolicitationPreviewPayloadInput): Promise<Coupon> {
    if (!!orderSolicitationPayload.coupon) {
      return this.couponRepository.findByName(orderSolicitationPayload.coupon);
    }
    new Coupon();
  }

  calculateOrderItemFreight(freight: Freight, item: OrderItem): void {
    const cost = item.quantity * freight.calculateMeasurementsCost(item.product.getMeasurements());
    freight.addCost(cost);
  }

  getFreightCalculated(orderItems: OrderItem[], distance = 1000): Freight {
    return orderItems.reduce((freight, orderItem: OrderItem) => {
      this.calculateOrderItemFreight(freight, orderItem);
      return freight;
    }, new Freight(distance));
  }

  async getOrderItemsWithProducts(items: OrderItem[]): Promise<OrderItem[]> {
    const products = await this.productRepository.findByIds(items.map((item) => item.product.id));
    if (products.length !== items.length)
      throw new OrderSolicitationException({
        type: OrderSolicitationExceptionType.PRODUCTS_LIST_DIFFER_ITEMS_LIST,
      });
    return items.map((item: OrderItem) => {
      const product = products.find((product: Product) => product.id === item.product.id);
      if (!product)
        throw new OrderSolicitationException({
          type: OrderSolicitationExceptionType.PRODUCT_NOT_FOUND,
        });
      item.setProduct(product);
      return item;
    });
  }

  async generate(orderSolicitationPayload: OrderSolicitationPreviewPayloadInput): Promise<OrderSolicitation> {
    const [orderItems, coupon] = await Promise.all([
      this.getOrderItemsWithProducts(
        orderSolicitationPayload.orderItems.map((item) => new OrderItem(new Product(item.productId), item.quantity)),
      ),
      this.getCoupon(orderSolicitationPayload),
    ]);
    const orderSolicitation = new OrderSolicitation(orderItems, coupon, this.getFreightCalculated(orderItems, 1000));
    orderSolicitation.setCpf(orderSolicitationPayload.cpf);
    orderSolicitation.calculateFinalTotalAmount();
    return orderSolicitation;
  }

  async preview(
    orderSolicitationPayload: OrderSolicitationPreviewPayloadInput,
  ): Promise<OrderSolicitationPreviewPayloadOutput> {
    const orderSolicitation = await this.generate(orderSolicitationPayload);
    return new OrderSolicitationPreviewPayloadOutput(
      orderSolicitation.getFinalTotalAmount(),
      orderSolicitation.getFreightCost(),
    );
  }

  async execute(orderSolicitationPayload: OrderSolicitationPreviewPayloadInput): Promise<OrderProcessorOutput> {
    const orderSolicitation = await this.generate(orderSolicitationPayload);
    const orderRepresentation = await this.orderRepository.create(orderSolicitation);
    return new OrderProcessorOutput(orderRepresentation.getSerialCode());
  }
}
