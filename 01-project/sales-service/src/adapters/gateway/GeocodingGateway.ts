import { Coordinates } from '../../business/entities/Coordinates';

export const GEO_CODING_GATEWAY = 'GEO_CODING_GATEWAY';

export interface GeocodingGateway {
  getLatLgnByPostalCode(postalCode: string): Promise<Coordinates>;
}
