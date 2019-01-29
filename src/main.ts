import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port: string = process.argv[2];
  console.log('The port is: ' + port);
  await app.listen(port);
}
bootstrap();
