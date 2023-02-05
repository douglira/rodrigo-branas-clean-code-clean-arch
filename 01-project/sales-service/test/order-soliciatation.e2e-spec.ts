import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

const timestampRegexMatching = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d{1,3}/;

describe('OrderSolicitationControllerV1 (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/v1/orders/solicitation-preview (POST)', () => {
    it('should success with 2 order items and 1 coupon', () => {
      const input = {
        cpf: '423.655.858-09',
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
        .post('/orders/solicitation-preview')
        .set('Accept', 'application/json')
        .send(input)
        .expect(HttpStatus.OK)
        .expect({ totalAmount: 131.84 });
    });
    it('should error with expired coupon', async () => {
      const input = {
        cpf: '423.655.858-09',
        coupon: 'VALE25',
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
        .post('/orders/solicitation-preview')
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

  afterAll(async () => {
    await app.close();
  });
});
