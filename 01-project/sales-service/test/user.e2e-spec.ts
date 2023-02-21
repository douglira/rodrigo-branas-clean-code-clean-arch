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
import { ORDER_DATABASE, OrderDatabaseInterface } from '../src/adapters/storage/data/OrderDatabaseInterface';

jest.mock('../src/config/Configuration.ts', () => ({
  default: async () => {
    const path = join(__dirname, '..', '.env', '.config.test.yaml');
    return yaml.load(readFileSync(path, 'utf8')) as Record<string, any>;
  },
}));

describe('UserControllerV1 (e2e)', () => {
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

  describe('GET /v1/users/:cpf/orders', () => {
    test('should list user orders by cpf', async () => {
      const cpf = '44433322211';
      const order = {
        cpf,
        totalAmount: 99.9,
        freightPrice: 10,
        items: [{ productId: 'ef9334b1-b7db-412c-81d8-874e87ffa562', quantity: 1, soldPrice: 89.9 }],
      };
      await db.any(
        `DELETE FROM sales_service.order_items USING sales_service.orders WHERE order_items.order_id = orders.id AND orders.cpf = '${cpf}'`,
      );
      await db.any(`DELETE FROM sales_service.orders WHERE cpf = '${cpf}'`);
      const orderDatabase = app.get<OrderDatabaseInterface>(ORDER_DATABASE);
      const inserted = await orderDatabase.register(order);
      return request(app.getHttpServer())
        .get(`/users/${cpf}/orders`)
        .set('Accept', 'application/json')
        .then((res) => {
          expect(res.statusCode).toEqual(HttpStatus.OK);
          expect(res.body).toHaveProperty('orders');
          expect(res.body.orders).toMatchObject([
            {
              total: '99.90',
              freight: '10.00',
              coupon: null,
              serialCode: inserted.serial_code,
              createdAt: inserted.created_at.toISOString(),
            },
          ]);
        });
    });
  });

  afterAll(async () => {
    await app.close();
    await db.$pool.end();
  });
});
