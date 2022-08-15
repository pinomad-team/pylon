import { Module } from '@nestjs/common';
import { BaseModule } from 'src/base/base.module';
import { RegisteredGrpcReflectionModule } from 'src/grpc';

@Module({
  imports: [BaseModule, RegisteredGrpcReflectionModule],
})
export class RpcModule {}
