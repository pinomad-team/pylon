import { Body } from '@nestjs/common';
import { Controller, Post } from '@nestjs/common';
import { ChannelCredentials, Client } from '@grpc/grpc-js';

@Controller('web')
export class WebController {
  @Post()
  async execute(@Body() payload: any): Promise<any> {
    const cli = new Client(
      'localhost:8001',
      ChannelCredentials.createInsecure(),
    );
    const rawResponse = await new Promise<Buffer>((resolve, reject) => {
      cli.makeUnaryRequest<Buffer, Buffer>(
        `/${payload.service}/${payload.method}`,
        (arg) => arg,
        (arg) => arg,
        Buffer.from(payload.request),
        (err, res) => {
          if (err) {
            return reject(err);
          }
          return resolve(res!);
        },
      );
    });
    return {
      response: Array.from(rawResponse),
    };
  }
}
