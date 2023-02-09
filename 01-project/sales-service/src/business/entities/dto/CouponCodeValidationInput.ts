export class CouponCodeValidationInput {
  constructor(readonly code: string) {
    this.code = code.toUpperCase();
  }
}
