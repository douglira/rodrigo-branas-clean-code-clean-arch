import { MeasurementsException, MeasurementsExceptionType } from '../exceptions/MeasurementsException';

export enum MeasurementCubicUnit {
  METERS,
  CENTIMETERS,
}

export class Measurements {
  private readonly volume: number;
  private readonly density: number;
  private readonly METERS_FACTOR = 1000000;
  constructor(
    readonly width: number = 0,
    readonly height: number = 0,
    readonly depth: number = 0,
    readonly weight: number = 0,
  ) {
    this.validateCreation();
    this.volume = this.width * this.height * this.depth;
    this.density = this.weight / this.getVolume(MeasurementCubicUnit.METERS);
  }

  isValidDimensions(): boolean {
    return this.width >= 0 && this.height >= 0 && this.depth >= 0 && this.weight >= 0;
  }

  getVolume(unit: MeasurementCubicUnit): number {
    if (unit == MeasurementCubicUnit.METERS) return this.volume / this.METERS_FACTOR;
    return this.volume;
  }

  getDensity(): number {
    return this.density;
  }

  private validateCreation() {
    if (!this.isValidDimensions())
      throw new MeasurementsException({ type: MeasurementsExceptionType.INVALID_MEASUREMENTS });
  }
}
