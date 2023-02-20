import { Module } from '@nestjs/common';
import { GEO_CODING_GATEWAY } from './GeocodingGateway';
import { GoogleGeocodingGateway } from './GoogleGeocodingGateway';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [{ provide: GEO_CODING_GATEWAY, useClass: GoogleGeocodingGateway }],
  exports: [{ provide: GEO_CODING_GATEWAY, useClass: GoogleGeocodingGateway }],
})
export class GatewayModule {}
