export const STORE_DATABASE = 'STORE DATABASE';

export interface StoreDatabaseInterface {
  get(id: string): Promise<any>;
}
