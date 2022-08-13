import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BaseController } from './base/base.controller';
import { BaseModule } from './base/base.module';
import { RegisteredGrpcReflectionModule } from './grpc';

@Module({
  imports: [BaseModule, RegisteredGrpcReflectionModule],
  controllers: [AppController, BaseController],
  providers: [AppService],
})
export class AppModule {}
