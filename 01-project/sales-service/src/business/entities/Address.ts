import { Coordinates } from './Coordinates';

export class Address {
  constructor(
    readonly id: string,
    readonly postalCode: string,
    readonly street: string,
    readonly streetNumber: string,
    readonly country: string,
    readonly city: string,
    readonly neighborhood: string,
    readonly province: string,
    readonly additionalData: string,
    readonly coord: Coordinates,
  ) {}
}
