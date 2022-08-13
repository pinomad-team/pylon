/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';

export const protobufPackage = 'base';

export interface PingRequest {
  name: string;
}

export interface PingResponse {
  value: string;
}

export const BASE_PACKAGE_NAME = 'base';

export interface BaseServiceClient {
  ping(request: PingRequest): Observable<PingResponse>;
}

export interface BaseServiceController {
  ping(
    request: PingRequest,
  ): Promise<PingResponse> | Observable<PingResponse> | PingResponse;
}

export function BaseServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['ping'];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('BaseService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcStreamMethod('BaseService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const BASE_SERVICE_NAME = 'BaseService';
