export class OrderSolicitationPreviewOutput {
  readonly totalAmount: number;
  readonly freightCost: number;
  constructor(totalAmount: number, freightCost: number) {
    this.totalAmount = parseFloat(totalAmount.toFixed(2));
    this.freightCost = parseFloat(freightCost.toFixed(2));
  }
}
