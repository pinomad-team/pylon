import { Metadata } from '@grpc/grpc-js';
import { Controller } from '@nestjs/common';
import { User } from '@proto/user/user';
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
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Controller('user')
@UserServiceControllerMethods()
export class UserController implements UserServiceController {
  constructor(private readonly userService: UserService) {}
  async getAllUsers(
    request: GetAllUsersRequest,
    metadata: Metadata,
  ): Promise<GetAllUsersResponse> {
    const users = await this.userService.getAllUsers();
    return {
      users: map(
        users,
        (u): User => ({
          id: u.id,
          onboarded: !!u.onboarded,
        }),
      ),
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
    const user = await this.userService.createUser();
    return {
      user: {
        id: user.id,
        onboarded: false,
      },
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
        user: {
          id: user?.id,
          onboarded: false,
        },
      };
    }
    throw new Error(`${id} not found`);
  }
}
