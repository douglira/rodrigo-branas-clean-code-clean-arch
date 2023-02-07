import Product from './Product';

describe('Entity:Product', () => {
  it('should comparate product by id', () => {
    const p1 = new Product('ID1');
    const p2 = new Product('ID1');
    expect(p1.isEqualById(p2)).toBeTruthy();
  });
});
