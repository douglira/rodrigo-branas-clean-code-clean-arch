import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import * as nock from 'nock';
import { join } from 'path';
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import * as pgPromise from 'pg-promise';
import { IClient } from 'pg-promise/typescript/pg-subset';
import { CONNECTION_PROVIDER } from '../src/adapters/storage/DatabaseConnection';
import { mockGoogleGeocodingApi } from './mock/utils';
import { ORDER_DATABASE, OrderDatabaseInterface } from '../src/adapters/storage/data/OrderDatabaseInterface';
import { OrderDatabase } from '../src/adapters/storage/data/OrderDatabase';

const timestampRegexMatching = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d{1,3}/;

jest.mock('../src/config/Configuration.ts', () => ({
  default: async () => {
    const path = join(__dirname, '..', '.env', '.config.test.yaml');
    return yaml.load(readFileSync(path, 'utf8')) as Record<string, any>;
  },
}));

describe('OrderSolicitationControllerV1 (e2e)', () => {
  let app: INestApplication;
  let db: pgPromise.IDatabase<any, IClient>;

  beforeAll(async () => {
    db = pgPromise({})({
      host: '0.0.0.0',
      port: 5432,
      database: 'sales_service',
      user: 'postgres',
      password: 'default',
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(CONNECTION_PROVIDER)
      .useValue(db)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('POST /v1/orders/preview', () => {
    test('should success with 2 order items and 1 coupon', async () => {
      mockGoogleGeocodingApi();
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
    test('should error with expired coupon', async () => {
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
    test('should error with repeated order item product', async () => {
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
  });

  describe('POST /v1/orders/checkout', () => {
    test('should checkout order solicitation', async () => {
      mockGoogleGeocodingApi();
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
        .post('/orders/checkout')
        .set('Accept', 'application/json')
        .send(input)
        .then((res) => {
          expect(res.statusCode).toEqual(HttpStatus.CREATED);
          expect(res.body).toHaveProperty('serialCode');
          expect(res.body).toHaveProperty('creationDate');
        });
    });
  });

  describe('GET /v1/orders/:serialCode', () => {
    test('should fetch order by serial code', async () => {
      const order = {
        cpf: '11122233344',
        totalAmount: 99.9,
        freightPrice: 10,
        items: [{ productId: 'ef9334b1-b7db-412c-81d8-874e87ffa562', quantity: 1, soldPrice: 89.9 }],
      };
      const orderDatabase = app.get<OrderDatabaseInterface>(ORDER_DATABASE);
      const inserted = await orderDatabase.register(order);
      return request(app.getHttpServer())
        .get(`/orders/${inserted.serial_code}`)
        .set('Accept', 'application/json')
        .then((res) => {
          expect(res.statusCode).toEqual(HttpStatus.OK);
          expect(res.body.total).toEqual('99.90');
          expect(res.body.freight).toEqual('10.00');
          expect(res.body.coupon).toEqual(null);
          expect(res.body.serialCode).toEqual(inserted.serial_code);
          expect(res.body).toHaveProperty('items');
          expect(res.body.createdAt).toEqual(inserted.created_at.toISOString());
        });
    });
  });

  afterAll(async () => {
    await app.close();
    await db.$pool.end();
    nock.cleanAll();
  });
});
