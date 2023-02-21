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
import * as nock from 'nock';
import { mockGoogleGeocodingApi } from './mock/utils';

jest.mock('../src/config/Configuration.ts', () => ({
  default: async () => {
    const path = join(__dirname, '..', '.env', '.config.test.yaml');
    return yaml.load(readFileSync(path, 'utf8')) as Record<string, any>;
  },
}));

describe('FreightControllerV1 (e2e)', () => {
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

  describe('POST /v1/freight/simulate', () => {
    test('should simulate freight cost', async () => {
      mockGoogleGeocodingApi();
      const input = {
        addresseePostalCode: '37653000',
        items: [
          {
            width: 20,
            height: 10,
            depth: 5,
            weight: 0.33,
            quantity: 1,
          },
          {
            width: 10,
            height: 7,
            depth: 5,
            weight: 0.18,
            quantity: 1,
          },
        ],
      };
      return request(app.getHttpServer())
        .post(`/freight/simulate`)
        .set('Accept', 'application/json')
        .send(input)
        .then((res) => {
          expect(res.statusCode).toEqual(HttpStatus.OK);
          expect(res.body).toMatchObject({ freightCost: 292.69 });
        });
    });
  });

  afterAll(async () => {
    await app.close();
    await db.$pool.end();
    nock.cleanAll();
  });
});
