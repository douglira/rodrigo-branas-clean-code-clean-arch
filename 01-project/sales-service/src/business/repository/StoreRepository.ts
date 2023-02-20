import { Inject, Injectable } from '@nestjs/common';
import { StoreRepositoryInterface } from './StoreRepositoryInterface';
import { STORE_DATABASE, StoreDatabaseInterface } from '../../adapters/storage/data/StoreDatabaseInterface';
import { Store } from '../entities/Store';
import { Address } from '../entities/Address';
import { Coordinates } from '../entities/Coordinates';

@Injectable()
export class StoreRepository implements StoreRepositoryInterface {
  constructor(@Inject(STORE_DATABASE) private storeDatabase: StoreDatabaseInterface) {}
  async get(storeId: string): Promise<Store> {
    const result = await this.storeDatabase.get(storeId);
    if (result) {
      return new Store(
        result.id,
        result.name,
        new Address(
          result.address.id,
          result.address.postalCode,
          result.address.street,
          result.address.streetNumber,
          result.address.country,
          result.address.city,
          result.address.neighborhood,
          result.address.province,
          result.address.additionalData,
          new Coordinates(result.address.lat, result.address.lng),
        ),
      );
    }
  }
}
