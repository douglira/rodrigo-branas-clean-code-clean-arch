import { Inject, Injectable } from '@nestjs/common';
import { OrderItemInput } from '../entities/dto/OrderItemInput';
import OrderItem from '../entities/OrderItem';
import Product from '../entities/Product';
import { OrderSolicitationException, OrderSolicitationExceptionType } from '../exceptions/OrderSolicitationException';
import { ProductRepositoryInterface, PRODUCT_REPOSITORY } from '../repository/ProductRepositoryInterface';
import { OrderItemServiceInterface } from './OrderItemServiceInterface';

@Injectable()
export class OrderItemService implements OrderItemServiceInterface {
  constructor(@Inject(PRODUCT_REPOSITORY) private readonly productRepository: ProductRepositoryInterface) {}

  async getOrderItemsWithProducts(items: OrderItemInput[]): Promise<OrderItem[]> {
    const products = await this.productRepository.findByIds(items.map((item: OrderItemInput) => item.productId));
    if (products.length !== items.length)
      throw new OrderSolicitationException({
        type: OrderSolicitationExceptionType.PRODUCTS_LIST_DIFFER_ITEMS_LIST,
      });
    return items.reduce((items: OrderItem[], orderItemInput: OrderItemInput) => {
      const product = products.find((product: Product) => product.id === orderItemInput.productId);
      if (!product)
        throw new OrderSolicitationException({
          type: OrderSolicitationExceptionType.PRODUCT_NOT_FOUND,
        });
      items.push(new OrderItem(product, orderItemInput.quantity));
      return items;
    }, new Array<OrderItem>());
  }
}
