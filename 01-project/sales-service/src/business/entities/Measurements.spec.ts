import { MeasurementsException, MeasurementsExceptionType } from '../exceptions/MeasurementsException';
import { Measurements } from './Measurements';

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
});
