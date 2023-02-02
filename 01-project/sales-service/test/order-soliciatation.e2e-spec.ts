import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('OrderSolicitationControllerV1 (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/v1/orders/solicitation-preview (POST)', () => {
    const input = {
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
      .post('/v1/orders/solicitation-preview')
      .set('Accept', 'application/json')
      .send(input)
      .expect(200)
      .expect({ totalAmount: 164.8 });
  });
});
