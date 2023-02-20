import { Address } from './Address';

export class Store {
  constructor(readonly id: string, readonly name: string, readonly address: Address) {}
}
