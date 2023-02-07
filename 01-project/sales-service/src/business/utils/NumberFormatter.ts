export class NumberFormatter {
  static currency(number: number): number {
    return Number(number.toString().match(/^\d+(?:\.\d{0,2})?/));
  }
}
