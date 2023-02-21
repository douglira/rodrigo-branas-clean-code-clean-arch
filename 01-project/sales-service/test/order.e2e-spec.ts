import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import * as nock from 'nock';
import { GoogleAPIConfig } from '../src/config/Configuration';
import { join } from 'path';
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { ConfigService } from '@nestjs/config';

const timestampRegexMatching = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d{1,3}/;

jest.mock('../src/config/Configuration.ts', () => ({
  default: async () => {
    const path = join(__dirname, '..', '.env', '.config.test.yaml');
    return yaml.load(readFileSync(path, 'utf8')) as Record<string, any>;
  },
}));

describe('OrderSolicitationControllerV1 (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    const configService = app.get(ConfigService);
    const googleConfig = configService.get<GoogleAPIConfig>('google');
    nock(/.*maps\.googleapis\.com.*/)
      .get(/.*/)
      .reply(200, {
        results: [
          {
            geometry: { location: { lat: -23.534082, lng: -46.204355 } },
          },
        ],
      });
    await app.init();
  });

  describe('/v1/orders/preview (POST)', () => {
    it('should success with 2 order items and 1 coupon', () => {
      const input = {
        cpf: '42365585809',
        addresseePostalCode: '37653000',
        coupon: 'VALE20',
        orderItems: [
          {
            productId: '2558a6df-c01f-41db-b378-75c7402508d5',
            quantity: 1,
          },
          {
            productId: 'a40b5de2-1038-4c7a-ac26-70d51f0e9e57',
            quantity: 1,
          },
        ],
      };
      return request(app.getHttpServer())
        .post('/orders/preview')
        .set('Accept', 'application/json')
        .send(input)
        .expect(HttpStatus.OK)
        .expect({ totalAmount: 2657.07, freightCost: 2525.23 });
    });
    it('should error with expired coupon', async () => {
      const input = {
        cpf: '42365585809',
        addresseePostalCode: '37653000',
        coupon: 'BEMVINDO10',
        orderItems: [
          {
            productId: '2558a6df-c01f-41db-b378-75c7402508d5',
            quantity: 1,
          },
          {
            productId: 'a40b5de2-1038-4c7a-ac26-70d51f0e9e57',
            quantity: 1,
          },
        ],
      };
      const result = await request(app.getHttpServer())
        .post('/orders/preview')
        .set('Accept', 'application/json')
        .send(input);
      expect(result.statusCode).toEqual(HttpStatus.CONFLICT);
      expect(result.body).toMatchObject({
        type: 'COUPON_EXPIRED',
        code: 'CET1000',
        timestamp: expect.stringMatching(timestampRegexMatching),
      });
    });
  });
  it('should error with repeated order item product', async () => {
    const input = {
      cpf: '42365585809',
      addresseePostalCode: '37653000',
      coupon: 'VALE20',
      orderItems: [
        {
          productId: '2558a6df-c01f-41db-b378-75c7402508d5',
          quantity: 1,
        },
        {
          productId: 'a40b5de2-1038-4c7a-ac26-70d51f0e9e57',
          quantity: 1,
        },
        {
          productId: 'a40b5de2-1038-4c7a-ac26-70d51f0e9e57',
          quantity: 1,
        },
      ],
    };
    const result = await request(app.getHttpServer())
      .post('/orders/preview')
      .set('Accept', 'application/json')
      .send(input);
    expect(result.statusCode).toEqual(HttpStatus.BAD_REQUEST);
    expect(result.body).toMatchObject({
      error: 'Bad Request',
      message: ['Duplicated products'],
      statusCode: 400,
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
