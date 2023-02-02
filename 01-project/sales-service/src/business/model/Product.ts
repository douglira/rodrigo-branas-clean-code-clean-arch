export default class Product {
  id: string;
  title: string;
  basePrice: number;

  constructor(id?: string, title?: string, basePrice?: number) {
    this.id = id;
    this.title = title;
    this.basePrice = basePrice;
  }

  isEqualById(product: Product): boolean {
    return product.id === this.id;
  }
}
