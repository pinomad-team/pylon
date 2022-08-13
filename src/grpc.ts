import { GrpcOptions, Transport } from '@nestjs/microservices';
import {
  addReflectionToGrpcConfig,
  GrpcReflectionModule,
} from 'nestjs-grpc-reflection';
import { resolve } from 'path';

export const grpcClientOptions: GrpcOptions = addReflectionToGrpcConfig({
  transport: Transport.GRPC,
  options: {
    package: 'base',
    protoPath: resolve(__dirname, '../../idl/base/base_service.proto'),
    url: '0.0.0.0:8001',
  },
});

export const RegisteredGrpcReflectionModule =
  GrpcReflectionModule.register(grpcClientOptions);
