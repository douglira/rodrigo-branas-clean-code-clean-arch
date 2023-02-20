import { Coordinates } from '../entities/Coordinates';
import { Store } from '../entities/Store';

export const STORE_REPOSITORY = 'STORE REPOSITORY';

export interface StoreRepositoryInterface {
  get(storeId: string): Promise<Store>;
  getNearby(coord: Coordinates): Promise<Store>;
}
