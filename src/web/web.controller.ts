import { Body, Headers, HttpException, HttpStatus } from '@nestjs/common';
import { Controller, Post } from '@nestjs/common';
import _ from 'lodash';
import { WebService } from './web.service';
import { generateGrpcMetadata } from '../common/grpc';

interface UnaryRequestBody {
  environment?: string;
  service: string;
  method: string;
  request: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer | Uint8Array>;
}

interface UnaryResponseBody {
  response: number[];
}

@Controller('web')
export class WebController {
  constructor(private readonly webService: WebService) {}

  @Post()
  async execute(
    @Body() payload: UnaryRequestBody,
    @Headers() headers: Record<string, any>,
  ): Promise<UnaryResponseBody> {
    const grpcMetadata = generateGrpcMetadata(headers);
    const rawResponse = await new Promise<Buffer>((resolve, reject) => {
      this.webService
        .getClient(payload.environment)
        .makeUnaryRequest<Buffer, Buffer>(
          `/${payload.service}/${payload.method}`,
          (arg) => arg,
          (arg) => arg,
          Buffer.from(payload.request),
          grpcMetadata,
          (err, res) => {
            if (err) {
              return reject(
                new HttpException(
                  {
                    grpcCode: err.code,
                    details: err.details,
                    message: err.message,
                    metadata: err.metadata.toJSON(),
                  },
                  HttpStatus.INTERNAL_SERVER_ERROR,
                ),
              );
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
