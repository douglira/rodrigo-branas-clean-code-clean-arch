import Product from './Product';

export default class OrderItem {
  product: Product;
  quantity: number;

  constructor(product: Product, quantity: number) {
    this.product = product;
    this.quantity = quantity;
  }

  setProduct(product: Product): void {
    this.product = product;
  }
}
