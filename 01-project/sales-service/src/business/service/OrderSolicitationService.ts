import { Inject, Injectable } from '@nestjs/common';
import OrderSolicitation from '../model/OrderSolicitation';
import { ProductRepositoryInterface, PRODUCT_REPOSITORY } from '../repository/ProductRepositoryInterface';
import { OrderSolicitationServiceInterface } from './OrderSolicitationServiceInterface';

@Injectable()
export class OrderSolicitationService implements OrderSolicitationServiceInterface {
  constructor(@Inject(PRODUCT_REPOSITORY) private readonly productRepository: ProductRepositoryInterface) {}

  async calculatePreview(orderSolicitation: OrderSolicitation): Promise<OrderSolicitation> {
    const products = await this.productRepository.getAll();
    console.log('calculating order solicitation preview', products);
    return orderSolicitation;
  }
}
