import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Testing basic requests to the server', () => {
  let app;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('processmanagement/isValidInput (POST) should return true', () => {
    return request(app.getHttpServer())
      .post('/processmanagement/isValidInput')
      .send({ path: 'bla.nest' })
      .expect(201)
      .expect('true');
  });
});
