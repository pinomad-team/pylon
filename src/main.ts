import { NestApplication, NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { grpcClientOptions } from './grpc';
import { WebModule } from './web/web.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    grpcClientOptions,
  );

  const web = await NestFactory.create<NestApplication>(WebModule, {
    cors: true,
  });
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    await app.listen();
    await web.listen(8000);
  } else {
    switch (process.env.PYLON_ENV) {
      case 'rpc':
        await app.listen();
        break;
      default:
        await web.listen(process.env.PORT || 8000);
        break;
    }
  }
}
bootstrap();
