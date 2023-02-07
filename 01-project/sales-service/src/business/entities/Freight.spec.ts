import Freight from './Freight';
import { Measurements } from './Measurements';

describe('Entity:Freight', () => {
  it('should initiate freight instance with zero cost and distance', () => {
    const freight = new Freight();
    expect(freight.getCost()).toEqual(0);
    expect(freight.getDistance()).toEqual(0);
  });
  it('should add cost', () => {
    const freight = new Freight();
    freight.addCost(10);
    freight.addCost(15);
    expect(freight.getCost()).toEqual(25);
  });
  it.each([
    ,
    { width: 100, height: 30, depth: 10, weight: 3, expectedFreightCost: 30 },
    { width: 200, height: 100, depth: 50, weight: 40, expectedFreightCost: 400 },
  ])('should calculate freight cost by measuments', ({ width, height, depth, weight, expectedFreightCost }) => {
    const freight = new Freight(1000);
    const measurements = new Measurements(width, height, depth, weight);
    expect(freight.calculateMeasurementsCost(measurements)).toEqual(expectedFreightCost);
  });
  it.each([{ width: 20, height: 15, depth: 10, weight: 1, expectedFreightCost: 10 }])(
    'should return 10 freight cost as minimum value',
    ({ width, height, depth, weight, expectedFreightCost }) => {
      const freight = new Freight(1000);
      const measurements = new Measurements(width, height, depth, weight);
      expect(freight.calculateMeasurementsCost(measurements)).toEqual(expectedFreightCost);
    },
  );
});
