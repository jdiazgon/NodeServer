import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProcessmanagementController } from './processmanagement/processmanagement.controller';
import { resetTimeout } from './main';

@Module({
  imports: [],
  controllers: [AppController, ProcessmanagementController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(resetTimeout).forRoutes(ProcessmanagementController);
  }
}
