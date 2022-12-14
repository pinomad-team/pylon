/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { AuthType, User } from './user';
import { Metadata } from '@grpc/grpc-js';
import { Observable } from 'rxjs';

export const protobufPackage = 'user';

export interface CreateUserRequest {
  user: User | undefined;
  authType: AuthType;
}

export interface CreateUserResponse {
  user: User | undefined;
}

export interface UpdateUserRequest {
  user: User | undefined;
  authType: AuthType;
}

export interface UpdateUserResponse {
  user: User | undefined;
}

export interface GetUserRequest {
  id: string;
}

export interface GetUserResponse {
  user: User | undefined;
}

export interface GetMyProfileRequest {
  authType: AuthType;
}

export interface GetMyProfileResponse {
  user: User | undefined;
}

export interface GetAllUsersRequest {}

export interface GetAllUsersResponse {
  users: User[];
}

export interface DeleteUserRequest {
  authType: AuthType;
}

export interface DeleteUserResponse {
  ok: boolean;
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

  getAllUsers(
    request: GetAllUsersRequest,
    metadata: Metadata,
    ...rest: any
  ): Observable<GetAllUsersResponse>;

  deleteUser(
    request: DeleteUserRequest,
    metadata: Metadata,
    ...rest: any
  ): Observable<DeleteUserResponse>;

  updateUser(
    request: UpdateUserRequest,
    metadata: Metadata,
    ...rest: any
  ): Observable<UpdateUserResponse>;

  getMyProfile(
    request: GetMyProfileRequest,
    metadata: Metadata,
    ...rest: any
  ): Observable<GetMyProfileResponse>;
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

  getAllUsers(
    request: GetAllUsersRequest,
    metadata: Metadata,
    ...rest: any
  ):
    | Promise<GetAllUsersResponse>
    | Observable<GetAllUsersResponse>
    | GetAllUsersResponse;

  deleteUser(
    request: DeleteUserRequest,
    metadata: Metadata,
    ...rest: any
  ):
    | Promise<DeleteUserResponse>
    | Observable<DeleteUserResponse>
    | DeleteUserResponse;

  updateUser(
    request: UpdateUserRequest,
    metadata: Metadata,
    ...rest: any
  ):
    | Promise<UpdateUserResponse>
    | Observable<UpdateUserResponse>
    | UpdateUserResponse;

  getMyProfile(
    request: GetMyProfileRequest,
    metadata: Metadata,
    ...rest: any
  ):
    | Promise<GetMyProfileResponse>
    | Observable<GetMyProfileResponse>
    | GetMyProfileResponse;
}

export function UserServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'createUser',
      'getUser',
      'getAllUsers',
      'deleteUser',
      'updateUser',
      'getMyProfile',
    ];
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
