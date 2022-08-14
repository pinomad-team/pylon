/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { User } from './user';
import { Metadata } from '@grpc/grpc-js';
import { Observable } from 'rxjs';

export const protobufPackage = 'user';

export interface CreateUserRequest {
  user: User | undefined;
}

export interface CreateUserResponse {
  user: User | undefined;
}

export interface GetUserRequest {
  id: string;
}

export interface GetUserResponse {
  user: User | undefined;
}

export const USER_PACKAGE_NAME = 'user';

export interface UserServiceClient {
  createUser(
    request: CreateUserRequest,
    metadata: Metadata,
    ...rest: any
  ): Observable<CreateUserResponse>;

  getUser(
    request: GetUserRequest,
    metadata: Metadata,
    ...rest: any
  ): Observable<GetUserResponse>;
}

export interface UserServiceController {
  createUser(
    request: CreateUserRequest,
    metadata: Metadata,
    ...rest: any
  ):
    | Promise<CreateUserResponse>
    | Observable<CreateUserResponse>
    | CreateUserResponse;

  getUser(
    request: GetUserRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<GetUserResponse> | Observable<GetUserResponse> | GetUserResponse;
}

export function UserServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['createUser', 'getUser'];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('UserService', method)(
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
      GrpcStreamMethod('UserService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const USER_SERVICE_NAME = 'UserService';
