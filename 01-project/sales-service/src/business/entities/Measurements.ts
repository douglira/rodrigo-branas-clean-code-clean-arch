import { MeasurementsException, MeasurementsExceptionType } from '../exceptions/MeasurementsException';

export enum MeasurementCubicFactor {
  CENTIMETERS = 1,
  METERS = 1000000,
}

export class Measurements {
  private readonly volume: number;
  private readonly density: number;
  constructor(
    readonly width: number = 0,
    readonly height: number = 0,
    readonly depth: number = 0,
    readonly weight: number = 0,
  ) {
    this.validateCreation();
    this.volume = this.width * this.height * this.depth;
    this.density = this.weight / this.getVolume(MeasurementCubicFactor.METERS);
  }

  isValidDimensions(): boolean {
    return this.width >= 0 && this.height >= 0 && this.depth >= 0 && this.weight >= 0;
  }

  getVolume(unit: MeasurementCubicFactor): number {
    return this.volume / unit.valueOf();
  }

  getDensity(): number {
    return this.density;
  }

  private validateCreation() {
    if (!this.isValidDimensions())
      throw new MeasurementsException({ type: MeasurementsExceptionType.INVALID_MEASUREMENTS });
  }
}
