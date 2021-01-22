import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { MergerEto } from '../src/processmanagement/etos/merger.eto';

describe('Testing basic requests to the server', () => {
  let app;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('processmanagement/tsplugin/merge (POST) should return merged values without overriding base', () => {
    const base = `class a {
                    async b(c:any):void{}
                  }`;
    const patch = `class a {
                    b(c:any):number{}
                  }`;
    const merger: MergerEto = new MergerEto(base, patch, false);

    return request(app.getHttpServer())
      .post('/processmanagement/tsplugin/merge')
      .send(merger)
      .expect(201)
      .expect('\nclass a {\nasync b(c: any): void\n{ \n\n}\n\n\n}\n');
  });

  it('processmanagement/tsplugin/merge (POST) should return merged values overriding base', () => {
    const base = `interface a {
                    b(c:any):void;
                  }`;
    const patch = `interface a {
                    b(c:any):number;
                  }`;
    const merger: MergerEto = new MergerEto(base, patch, true);

    return request(app.getHttpServer())
      .post('/processmanagement/tsplugin/merge')
      .send(merger)
      .expect(201)
      .expect('\ninterface a {\nb(c: any): number;\n\n\n}\n');
  });
});
