import { ChannelCredentials, Client } from '@grpc/grpc-js';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface GrpcConfig {
  host: string;
  secure?: boolean;
}

@Injectable()
export class WebService {
  constructor(private readonly configService: ConfigService) {}

  getClient(): Client {
    const config = this.configService.get<GrpcConfig>(
      `${process.env.NODE_ENV || 'development'}.grpc`,
    )!;
    console.log(config);
    const cli = new Client(
      config?.host,
      config?.secure
        ? ChannelCredentials.createSsl()
        : ChannelCredentials.createInsecure(),
    );
    return cli;
  }
}
