import { Metadata } from '@grpc/grpc-js';
import { Controller } from '@nestjs/common';
import {
  CreateUserRequest,
  CreateUserResponse,
  GetUserRequest,
  GetUserResponse,
  UserServiceController,
  UserServiceControllerMethods,
} from '@proto/user/user_service';
import { UserService } from './user.service';

@Controller('user')
@UserServiceControllerMethods()
export class UserController implements UserServiceController {
  constructor(private readonly userService: UserService) {}
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
