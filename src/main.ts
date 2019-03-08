import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  let port: string = process.argv[2];
  app.use(bodyParser.json({ limit: '12mb' }));
  app.use(bodyParser.urlencoded({ limit: '12mb', extended: true }));

  console.log('The port is: ' + port);
  await app.listen(port);
}
bootstrap();
