import { Inject, Injectable } from '@nestjs/common';
import { FreightCalculatorOutput } from '../../entities/dto/FreightCalculatorOutput';
import { OrderItemInput } from '../../entities/dto/OrderItemInput';
import Freight from '../../entities/Freight';
import OrderItem from '../../entities/OrderItem';
import { SimulateFreightInterface } from './SimulateFreightInterface';
import Product from '../../entities/Product';
import {
  OrderSolicitationException,
  OrderSolicitationExceptionType,
} from '../../exceptions/OrderSolicitationException';
import { PRODUCT_REPOSITORY, ProductRepositoryInterface } from '../../repository/ProductRepositoryInterface';
import { FreightCalculatorInput } from '../../entities/dto/FreightCalculatorInput';
import { GEO_CODING_GATEWAY, GeocodingGateway } from '../../../adapters/gateway/GeocodingGateway';
import { STORE_REPOSITORY, StoreRepositoryInterface } from '../../repository/StoreRepositoryInterface';
import { DistanceCalculator, DistanceFactor } from '../../entities/DistanceCalculator';

@Injectable()
export class SimulateFreight implements SimulateFreightInterface {
  constructor(
    @Inject(PRODUCT_REPOSITORY) private readonly productRepository: ProductRepositoryInterface,
    @Inject(GEO_CODING_GATEWAY) private readonly geocodingGateway: GeocodingGateway,
    @Inject(STORE_REPOSITORY) private readonly storeRepository: StoreRepositoryInterface,
  ) {}

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

  private calculateOrderItem(freight: Freight, item: OrderItem): void {
    const cost = item.quantity * freight.calculateMeasurementsCost(item.product.getMeasurements());
    freight.addCost(cost);
  }

  getCalculationFromOrderItem(orderItem: OrderItem, distance = 1000): Freight {
    const freight = new Freight(distance);
    this.calculateOrderItem(freight, orderItem);
    return freight;
  }

  getCalculationFromOrderItems(orderItems: OrderItem[], distance = 1000): Freight {
    return orderItems.reduce((freight, orderItem: OrderItem) => {
      this.calculateOrderItem(freight, orderItem);
      return freight;
    }, new Freight(distance));
  }

  async execute(input: FreightCalculatorInput): Promise<FreightCalculatorOutput> {
    const store = await this.storeRepository.get(input.storeId);
    const AddresseeCoord = await this.geocodingGateway.getLatLgnByPostalCode(input.addresseePostalCode);
    const distance = DistanceCalculator.calculate(
      store.address.coord,
      AddresseeCoord,
      DistanceFactor.KILOMETERS_TO_METERS,
    );
    const orderItems = await this.getOrderItemsWithProducts(input.items);
    return new FreightCalculatorOutput(this.getCalculationFromOrderItems(orderItems, distance).getCost());
  }
}
