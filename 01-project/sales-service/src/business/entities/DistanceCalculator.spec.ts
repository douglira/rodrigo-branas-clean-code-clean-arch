import { Coordinates } from './Coordinates';
import { DistanceCalculator, DistanceFactor } from './DistanceCalculator';

describe('Entity:DistanceCalculator', () => {
  it('should calculate distance in km between to coordinates', () => {
    const from = new Coordinates(-23.531346, -46.204938);
    const to = new Coordinates(-23.540731, -46.202817);
    const distance = DistanceCalculator.calculate(from, to, DistanceFactor.KILOMETERS_TO_METERS);
    expect(distance).toEqual(1065.6783320749137);
  });
});
