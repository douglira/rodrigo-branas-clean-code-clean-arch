import { Inject, Injectable } from '@nestjs/common';
import OrderItem from '../model/OrderItem';
import OrderSolicitation from '../model/OrderSolicitation';
import { ProductRepositoryInterface, PRODUCT_REPOSITORY } from '../repository/ProductRepositoryInterface';
import { OrderSolicitationServiceInterface } from './OrderSolicitationServiceInterface';

@Injectable()
export class OrderSolicitationService implements OrderSolicitationServiceInterface {
  constructor(@Inject(PRODUCT_REPOSITORY) private readonly productRepository: ProductRepositoryInterface) {}

  async calculatePreview(orderSolicitation: OrderSolicitation): Promise<OrderSolicitation> {
    const products = await this.productRepository.findByIds(
      orderSolicitation.getItems().map((item: OrderItem) => item.product.id),
    );
    orderSolicitation.calculateFinalTotalAmountByProducts(products);
    orderSolicitation.calculateDiscountOverFinalAmount();
    return orderSolicitation;
  }
}
