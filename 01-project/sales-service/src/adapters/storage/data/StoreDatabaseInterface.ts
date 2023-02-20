export const STORE_DATABASE = 'STORE DATABASE';

export interface StoreDatabaseInterface {
  get(id: string): Promise<any>;
  getNearby(lat: number, lng: number): Promise<any>;
}
