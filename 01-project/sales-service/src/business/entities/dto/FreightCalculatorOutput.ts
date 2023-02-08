export class FreightCalculatorOutput {
  readonly freightCost: number;
  constructor(freightCost: number) {
    this.freightCost = parseFloat(freightCost.toFixed(2));
  }
}
