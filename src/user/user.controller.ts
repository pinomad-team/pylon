import { Metadata } from '@grpc/grpc-js';
import { Controller, UseInterceptors } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { AuthType, User, UserAuth } from '@proto/user/user';
import {
  CreateUserRequest,
  CreateUserResponse,
  DeleteUserRequest,
  DeleteUserResponse,
  GetAllUsersRequest,
  GetAllUsersResponse,
  GetMyProfileRequest,
  GetMyProfileResponse,
  GetUserRequest,
  GetUserResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  UserServiceController,
  UserServiceControllerMethods,
} from '@proto/user/user_service';
import { GrpcStatusCode } from '@protobuf-ts/grpcweb-transport';
import { map, merge } from 'lodash';
import { FIREBASE_UID_HEADER } from 'src/common/auth';
import { FirebaseAuthInterceptor } from 'src/firebase-auth.interceptor';
import {
  AuthType as AuthTypeEnum,
  UserAccount,
  UserAuth as UserAuthEntity,
} from 'src/model/user.entity';
import { AuthTypeAndExternalId, UserService } from './user.service';

interface RequestWithAuthType {
  authType: AuthType;
}

@Controller('user')
@UserServiceControllerMethods()
@UseInterceptors(FirebaseAuthInterceptor)
export class UserController implements UserServiceController {
  constructor(private readonly userService: UserService) {}

  static getFirebaseAuthTypeAndExternalId(
    request: RequestWithAuthType,
    metadata: Metadata,
  ): AuthTypeAndExternalId | null {
    const authType = AuthType[request.authType] as AuthTypeEnum;
    const externalId = UserController.getFirebaseUID(metadata);
    if (externalId) {
      return {
        authType,
        externalId,
      };
    }
    return null;
  }

  static userEntityToProtoMapper(user: UserAccount): User {
    return {
      id: user.id,
      onboarded: !!user.onboarded,
      userAuths: map<UserAuthEntity, UserAuth>(user.auths, (ent) => ({
        id: ent.id,
        authType: AuthType[ent.authType],
        externalId: ent.externalId,
        userId: ent.userId,
      })),
      name: user.name,
      displayName: user.displayName,
      createdAt: undefined,
      modifiedAt: undefined,
      email: user.email,
      phoneNumber: user.phoneNumber,
    };
  }

  static userProtoToEntityMapper(user: User): UserAccount {
    return {
      id: user.id,
      name: user.name,
      displayName: user.displayName,
      email: user.email,
      phoneNumber: user.phoneNumber,
    };
  }

  static getFirebaseUID(metadata: Metadata): string | null {
    const uids = metadata.get(FIREBASE_UID_HEADER);
    if (uids.length && uids[0]) {
      return uids[0].toString();
    }
    return null;
  }

  async getAllUsers(
    request: GetAllUsersRequest,
    metadata: Metadata,
  ): Promise<GetAllUsersResponse> {
    const users = await this.userService.getAllUsers();
    return {
      users: map<UserAccount, User>(
        users,
        (user): User => UserController.userEntityToProtoMapper(user),
      ),
    };
  }

  async deleteUser(
    request: DeleteUserRequest,
    metadata: Metadata,
  ): Promise<DeleteUserResponse> {
    const authTypeWithExternalId =
      UserController.getFirebaseAuthTypeAndExternalId(request, metadata);
    if (authTypeWithExternalId) {
      const user = await this.userService.getUserByAuthTypeAndExternalId(
        authTypeWithExternalId.authType,
        authTypeWithExternalId.externalId,
      );
      if (user) {
        const count = await this.userService.deleteUser(user.id);
        return {
          ok: !!count,
        };
      }
    }
    throw new RpcException('External ID not found');
  }

  async createUser(
    request: CreateUserRequest,
    metadata: Metadata,
  ): Promise<CreateUserResponse> {
    const authType = AuthType[request.authType] as AuthTypeEnum;
    const uid = UserController.getFirebaseUID(metadata);
    if (uid) {
      const user = await this.userService.createUser(
        authType,
        uid,
        request.user?.email || request.user?.phoneNumber,
        request.user?.phoneNumber,
        request.user?.email,
      );

      return {
        user: UserController.userEntityToProtoMapper(user),
      };
    }
    throw new RpcException('UID does not exist');
  }

  async getUser(
    request: GetUserRequest,
    metadata: Metadata,
  ): Promise<GetUserResponse> {
    const { id } = request;
    const user = await this.userService.getUser(id);
    if (user) {
      return {
        user: UserController.userEntityToProtoMapper(user),
      };
    }
    throw new RpcException(`${id} not found`);
  }

  async getMyProfile(
    request: GetMyProfileRequest,
    metadata: Metadata,
  ): Promise<GetMyProfileResponse> {
    const authTypeWithExternalId =
      UserController.getFirebaseAuthTypeAndExternalId(request, metadata);
    if (authTypeWithExternalId) {
      const user = await this.userService.getUserByAuthTypeAndExternalId(
        authTypeWithExternalId.authType,
        authTypeWithExternalId.externalId,
      );
      if (user) {
        return {
          user: UserController.userEntityToProtoMapper(user),
        };
      }
      throw new RpcException({
        code: GrpcStatusCode.NOT_FOUND,
        message: `User with ${authTypeWithExternalId.externalId} from not found`,
      });
    }
    throw new RpcException(`No external ID found`);
  }

  async updateUser(
    request: UpdateUserRequest,
    metadata: Metadata,
  ): Promise<UpdateUserResponse> {
    const authTypeWithExternalId =
      UserController.getFirebaseAuthTypeAndExternalId(request, metadata);
    if (authTypeWithExternalId) {
      const user = await this.userService.getUserByAuthTypeAndExternalId(
        authTypeWithExternalId.authType,
        authTypeWithExternalId.externalId,
      );
      if (user) {
        const userToUpdate = UserController.userProtoToEntityMapper(
          request.user ?? ({} as User),
        );
        const merged = merge(user, userToUpdate);
        const updated = await this.userService.updateUser(merged);
        return {
          user: UserController.userEntityToProtoMapper(updated),
        };
      }
      throw new RpcException(
        `User with ${authTypeWithExternalId.externalId} from not found`,
      );
    }
    throw new RpcException(`No external ID found`);
  }
}
