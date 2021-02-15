import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { InputFileEto } from '../src/processmanagement/etos/input-file.eto';

describe('Testing basic requests to the server', () => {
  let app;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('processmanagement/tsplugin/beautify (POST) should return beautified code', () => {
    const content = `class a {
                    b(c:any):void;
                  }`;
    const file: InputFileEto = new InputFileEto('', content, '');

    return request(app.getHttpServer())
      .post('/processmanagement/tsplugin/beautify')
      .send(file)
      .expect(201)
      .expect('class a {\n    b(c: any): void;\n}');
  });
});
