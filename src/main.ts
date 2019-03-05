import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port: string = '5010'; // 5010 is the port for development testing
  console.log('The port is: ' + port);
  await app.listen(port);
}
bootstrap();
