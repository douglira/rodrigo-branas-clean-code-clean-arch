import { Inject, Injectable } from '@nestjs/common';
import { FreightCalculatorOutput } from '../../entities/dto/FreightCalculatorOutput';
import Freight from '../../entities/Freight';
import { SimulateFreightInterface } from './SimulateFreightInterface';
import { FreightCalculatorInput, FreightItemInput } from '../../entities/dto/FreightCalculatorInput';
import { GEO_CODING_GATEWAY, GeocodingGateway } from '../../../adapters/gateway/GeocodingGateway';
import { STORE_REPOSITORY, StoreRepositoryInterface } from '../../repository/StoreRepositoryInterface';
import { DistanceCalculator, DistanceFactor } from '../../entities/DistanceCalculator';
import { Measurements } from '../../entities/Measurements';

@Injectable()
export class SimulateFreight implements SimulateFreightInterface {
  constructor(
    @Inject(GEO_CODING_GATEWAY) private readonly geocodingGateway: GeocodingGateway,
    @Inject(STORE_REPOSITORY) private readonly storeRepository: StoreRepositoryInterface,
  ) {}

  private calculateOrderItem(freight: Freight, item: FreightItemInput): void {
    const cost =
      item.quantity *
      freight.calculateMeasurementsCost(
        new Measurements(item.product.width, item.product.height, item.product.depth, item.product.weight),
      );
    freight.addCost(cost);
  }

  async execute(input: FreightCalculatorInput): Promise<FreightCalculatorOutput> {
    const addresseeCoord = await this.geocodingGateway.getLatLgnByPostalCode(input.addresseePostalCode);
    const store = await this.storeRepository.getNearby(addresseeCoord);
    const distance = DistanceCalculator.calculate(store.address.coord, addresseeCoord, DistanceFactor.METERS);
    const freight = new Freight(distance);
    for (const item of input.items) {
      this.calculateOrderItem(freight, item);
    }
    return new FreightCalculatorOutput(freight.getCost());
  }
}
