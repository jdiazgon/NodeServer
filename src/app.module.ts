import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProcessmanagementController } from './processmanagement/processmanagement.controller';

@Module({
  imports: [],
  controllers: [AppController, ProcessmanagementController],
  providers: [AppService],
})
export class AppModule {}
