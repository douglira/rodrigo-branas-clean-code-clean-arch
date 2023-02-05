import { MeasurementCubicUnit, Measurements } from './Measurements';

export class Freight {
  private readonly MIN_COST_MEASUREMENTS = 10;
  private cost: number;
  constructor(private readonly distance: number = 0) {}

  getCost(): number {
    return this.cost;
  }

  calculateMeasurementsCost(measurements: Measurements): number {
    const cost =
      this.distance *
      measurements.getVolume(MeasurementCubicUnit.METERS) *
      (Math.floor(measurements.getDensity()) / 100);

    return cost >= this.MIN_COST_MEASUREMENTS ? cost : this.MIN_COST_MEASUREMENTS;
  }

  calculateCost(measurementsList: Measurements[]): void {
    const cost = measurementsList.reduce((accumulator, measurements: Measurements) => {
      return accumulator + this.calculateMeasurementsCost(measurements);
    }, 0);

    this.cost = cost;
  }
}
