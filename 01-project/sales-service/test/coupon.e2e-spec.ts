import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { join } from 'path';
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import * as pgPromise from 'pg-promise';
import { IClient } from 'pg-promise/typescript/pg-subset';
import { CONNECTION_PROVIDER } from '../src/adapters/storage/DatabaseConnection';

jest.mock('../src/config/Configuration.ts', () => ({
  default: async () => {
    const path = join(__dirname, '..', '.env', '.config.test.yaml');
    return yaml.load(readFileSync(path, 'utf8')) as Record<string, any>;
  },
}));

describe('CouponControllerV1 (e2e)', () => {
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

  describe('GET /v1/coupon/:code/validate', () => {
    test('should return a valid coupon', async () => {
      const coupon = 'VALE20';
      return request(app.getHttpServer())
        .get(`/coupon/${coupon}/validate`)
        .set('Accept', 'application/json')
        .expect(HttpStatus.OK)
        .expect({ isValidCoupon: true });
    });
    test('should return an invalid coupon', async () => {
      const coupon = 'BEMVINDO10';
      return request(app.getHttpServer())
        .get(`/coupon/${coupon}/validate`)
        .set('Accept', 'application/json')
        .expect(HttpStatus.OK)
        .expect({ isValidCoupon: false });
    });
  });

  afterAll(async () => {
    await app.close();
    await db.$pool.end();
  });
});
