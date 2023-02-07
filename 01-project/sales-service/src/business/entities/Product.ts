import { Measurements } from './Measurements';

export default class Product {
  id: string;
  title: string;
  basePrice: number;
  private readonly measurements: Measurements;

  constructor(id?: string, title?: string, basePrice?: number, measurements?: Measurements) {
    this.id = id;
    this.title = title;
    this.basePrice = basePrice;
    this.measurements = measurements;
  }

  isEqualById(product: Product): boolean {
    return product.id === this.id;
  }

  getMeasurements(): Measurements {
    return this.measurements;
  }
}
