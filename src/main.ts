import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { resolve } from 'path';
import { AppModule } from './app.module';
import { grpcClientOptions } from './grpc';

async function bootstrap() {
  const protopath = resolve(__dirname, '../../idl/base/base_service.proto');
  console.log(protopath);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    grpcClientOptions,
  );
  await app.listen();
}
bootstrap();
