import { Body } from '@nestjs/common';
import { Controller, Post } from '@nestjs/common';
import { Client } from '@grpc/grpc-js';
import { WebService } from './web.service';

interface UnaryRequestBody {
  service: string;
  method: string;
  request: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer | Uint8Array>;
}

interface UnaryResponseBody {
  response: number[];
}

@Controller('web')
export class WebController {
  private client: Client;

  constructor(private readonly webService: WebService) {
    this.client = webService.getClient();
  }

  @Post()
  async execute(@Body() payload: UnaryRequestBody): Promise<UnaryResponseBody> {
    const rawResponse = await new Promise<Buffer>((resolve, reject) => {
      this.client.makeUnaryRequest<Buffer, Buffer>(
        `/${payload.service}/${payload.method}`,
        (arg) => arg,
        (arg) => arg,
        Buffer.from(payload.request),
        (err, res) => {
          if (err) {
            return reject(err);
          }
          if (res) {
            return resolve(res);
          }
        },
      );
    });
    return {
      response: Array.from(rawResponse),
    };
  }
}
