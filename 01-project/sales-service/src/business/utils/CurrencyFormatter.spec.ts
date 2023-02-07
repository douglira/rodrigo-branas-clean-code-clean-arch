import { NumberFormatter } from './NumberFormatter';

describe('Util:NumberFormatter', () => {
  it.each([
    { num: 235.241524, result: 235.24 },
    { num: 53434.437876, result: 53434.43 },
    { num: 0.675985, result: 0.67 },
  ])('should format number with 2 decimal places', ({ num, result }) => {
    expect(NumberFormatter.currency(num)).toEqual(result);
  });
});
