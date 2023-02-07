import { MeasurementsException, MeasurementsExceptionType } from '../exceptions/MeasurementsException';
import { MeasurementCubicFactor, Measurements } from './Measurements';

describe('Model:Measurements', () => {
  it.each([
    { height: -1, width: 10, depth: 10, weight: 10 },
    { height: 10, width: -1, depth: 10, weight: 10 },
    { height: 10, width: 10, depth: -1, weight: 10 },
    { height: 10, width: 10, depth: 10, weight: -1 },
  ])('should throw error for negative values', ({ height, width, depth, weight }) => {
    const instanceError = () => new Measurements(width, height, depth, weight);
    expect(instanceError).toThrow(MeasurementsException);
    expect(instanceError).toThrow(MeasurementsExceptionType.INVALID_MEASUREMENTS.toString());
  });
  it('should get volume in centimeters', () => {
    const measurements = new Measurements(20, 10, 15, 1);
    expect(measurements.getVolume(MeasurementCubicFactor.CENTIMETERS)).toEqual(3000);
  });
  it('should get volume in meters', () => {
    const measurements = new Measurements(20, 10, 15, 1);
    expect(measurements.getVolume(MeasurementCubicFactor.METERS)).toEqual(0.003);
  });
  it('should get density', () => {
    const measurements = new Measurements(20, 10, 15, 1);
    expect(measurements.getDensity()).toEqual(333.3333333333333);
  });
});
