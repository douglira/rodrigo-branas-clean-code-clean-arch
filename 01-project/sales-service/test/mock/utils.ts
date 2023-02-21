import * as nock from 'nock';

export function mockGoogleGeocodingApi() {
  nock(/.*maps\.googleapis\.com.*/)
    .get(/.*maps\/api\/geocode.*/)
    .reply(200, {
      results: [
        {
          geometry: { location: { lat: -23.534082, lng: -46.204355 } },
        },
      ],
    });
}
