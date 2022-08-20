import { Metadata } from '@grpc/grpc-js';
import { Controller, UseInterceptors } from '@nestjs/common';
import { AuthType, User, UserAuth } from '@proto/user/user';
import {
  CreateUserRequest,
  CreateUserResponse,
  DeleteUserRequest,
  DeleteUserResponse,
  GetAllUsersRequest,
  GetAllUsersResponse,
  GetUserRequest,
  GetUserResponse,
  UserServiceController,
  UserServiceControllerMethods,
} from '@proto/user/user_service';
import { map } from 'lodash';
import { FIREBASE_UID_HEADER } from 'src/common/auth';
import { FirebaseAuthInterceptor } from 'src/firebase-auth.interceptor';
import {
  AuthType as AuthTypeEnum,
  UserAccount,
  UserAuth as UserAuthEntity,
} from 'src/model/user.entity';
import { UserService } from './user.service';

function entityToProtoMapper(user: UserAccount): User {
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
  };
}

@Controller('user')
@UserServiceControllerMethods()
@UseInterceptors(FirebaseAuthInterceptor)
export class UserController implements UserServiceController {
  constructor(private readonly userService: UserService) {}
  async getAllUsers(
    request: GetAllUsersRequest,
    metadata: Metadata,
  ): Promise<GetAllUsersResponse> {
    const users = await this.userService.getAllUsers();
    return {
      users: map(users, (user): User => entityToProtoMapper(user)),
    };
  }

  async deleteUser(
    request: DeleteUserRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<DeleteUserResponse> {
    const count = await this.userService.deleteUser(request.id);
    return {
      ok: !!count,
    };
  }

  async createUser(
    request: CreateUserRequest,
    metadata: Metadata,
  ): Promise<CreateUserResponse> {
    const authType = AuthType[request.authType];
    const uids = metadata.get(FIREBASE_UID_HEADER);
    let uid;
    if (uids.length && uids[0]) {
      uid = uids[0].toString();
    }
    const user = await this.userService.createUser(
      authType as AuthTypeEnum,
      uid,
      request.user?.email || request.user?.phoneNumber,
    );

    return {
      user: entityToProtoMapper(user),
    };
  }

  async getUser(
    request: GetUserRequest,
    metadata: Metadata,
  ): Promise<GetUserResponse> {
    const { id } = request;
    const user = await this.userService.getUser(id);
    if (user) {
      return {
        user: entityToProtoMapper(user),
      };
    }
    throw new Error(`${id} not found`);
  }
}
