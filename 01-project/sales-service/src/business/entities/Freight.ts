import { NumberFormatter } from '../utils/NumberFormatter';
import { MeasurementCubicFactor, Measurements } from './Measurements';

export default class Freight {
  private readonly MIN_COST_MEASUREMENTS = 10;
  private cost = 0;
  constructor(private readonly distance: number = 0) {}

  getCost(): number {
    return this.cost;
  }

  getDistance(): number {
    return this.distance;
  }

  calculateMeasurementsCost(measurements: Measurements): number {
    const cost =
      this.distance *
      measurements.getVolume(MeasurementCubicFactor.METERS) *
      (Math.floor(measurements.getDensity()) / 100);
    return NumberFormatter.currency(Math.max(cost, this.MIN_COST_MEASUREMENTS));
  }

  addCost(cost: number): void {
    this.cost += cost;
  }
}
