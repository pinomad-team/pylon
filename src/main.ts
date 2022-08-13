import { NestApplication, NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { resolve } from 'path';
import { AppModule } from './app.module';
import { grpcClientOptions } from './grpc';
import { WebModule } from './web/web.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    grpcClientOptions,
  );

  const web = await NestFactory.create<NestApplication>(WebModule);
  await app.listen();

  await web.listen(3000);
}
bootstrap();
