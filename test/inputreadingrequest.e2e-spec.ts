import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Testing input reader request to the server', () => {
  let app;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('processmanagement/tsplugin/getInputModel (POST) should return true', () => {
    return request(app.getHttpServer())
      .post('processmanagement/tsplugin/getInputModel')
      .send({ content: 'class a {}' })
      .expect(201)
      .toBeNonEmptyString();
  });
});
