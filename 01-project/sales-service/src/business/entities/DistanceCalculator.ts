import { Coordinates } from './Coordinates';

export enum DistanceFactor {
  KILOMETERS_TO_METERS = 1000,
  MILES_TO_KILOMETERS = 1.609344,
}

export class DistanceCalculator {
  static calculate(from: Coordinates, to: Coordinates, factor?: DistanceFactor): number {
    // ### Haversine Formula ###
    if (from.lat == to.lat && from.lng == to.lng) return 0;
    const radlat1 = (Math.PI * from.lat) / 180;
    const radlat2 = (Math.PI * to.lat) / 180;
    const theta = from.lng - to.lng;
    const radtheta = (Math.PI * theta) / 180;
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) dist = 1;
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    dist = dist * DistanceFactor.MILES_TO_KILOMETERS;

    if (factor === DistanceFactor.KILOMETERS_TO_METERS) return dist * DistanceFactor.KILOMETERS_TO_METERS;
    return dist;
  }
}
