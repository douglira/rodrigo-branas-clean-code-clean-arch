import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GeocodingGateway } from './GeocodingGateway';
import { Coordinates } from '../../business/entities/Coordinates';
import { HttpService } from '@nestjs/axios';
import { GoogleAPIConfig } from '../../config/Configuration';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class GoogleGeocodingGateway implements GeocodingGateway {
  constructor(private configService: ConfigService, private httpService: HttpService) {}

  async getLatLgnByPostalCode(postalCode: string): Promise<Coordinates> {
    const config = this.configService.get<GoogleAPIConfig>('google');
    try {
      const { data } = await firstValueFrom(
        this.httpService
          .get(config.geocoding_api, {
            params: {
              key: config.api_key,
              address: postalCode,
            },
          })
          .pipe(
            catchError((error: AxiosError) => {
              console.log(error);
              throw error;
            }),
          ),
      );

      return new Coordinates(data.results[0].geometry.location.lat, data.results[0].geometry.location.lng);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
