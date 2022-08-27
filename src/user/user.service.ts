import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { AuthType, UserAccount, UserAuth } from 'src/model/user.entity';
import { EntityManager, Repository } from 'typeorm';
import * as xid from 'xid';

export interface AuthTypeAndExternalId {
  authType: AuthType;
  externalId: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    @InjectRepository(UserAccount)
    private readonly usersRepository: Repository<UserAccount>,
    @InjectRepository(UserAuth)
    private readonly userAuthRepository: Repository<UserAuth>,
  ) {}

  async createUser(
    authType: AuthType,
    externalId?: string,
    userId?: string,
    phoneNumber?: string,
    email?: string,
  ): Promise<UserAccount> {
    console.log(userId);
    const authToSave = new UserAuth();
    authToSave.id = xid.generateId();
    const userToSave = new UserAccount();
    userToSave.id = xid.generateId();
    userToSave.onboarded = true;
    userToSave.phoneNumber = phoneNumber;
    userToSave.email = email;
    authToSave.authType = authType;
    authToSave.externalId = externalId;
    authToSave.userId = userId;
    const tx = async (
      transactionManager: EntityManager,
    ): Promise<[UserAccount, UserAuth]> => {
      const userResult = await transactionManager.save(userToSave);
      authToSave.userAccount = userResult;
      const authResult = await transactionManager.save(authToSave);
      return [userResult, authResult];
    };
    const [userResult, authResult] = await this.entityManager.transaction(tx);
    userResult.auths = [authResult];
    return userResult;
  }

  async getUser(id: string): Promise<UserAccount | null> {
    xid.validate(id);
    const userResult = await this.usersRepository.findOneBy({
      id,
    });
    const authResults = await this.userAuthRepository.findBy({
      userAccount: {
        id,
      },
    });

    if (userResult) {
      userResult.auths = authResults;
    }
    return userResult;
  }

  async getUserByAuthTypeAndExternalId(
    authType: AuthType,
    externalId: string,
  ): Promise<UserAccount | null> {
    const authResult = await this.userAuthRepository.findOneBy({
      authType,
      externalId,
    });

    if (authResult) {
      const userResult = await this.usersRepository.findOneBy({
        id: authResult.userAccount.id,
      });
      return userResult;
    }
    return null;
  }

  async updateUser(user: UserAccount): Promise<UserAccount> {
    xid.validate(user.id);
    await this.usersRepository.update(user.id, user);
    const updatedUser = await this.getUser(user.id);
    return updatedUser!;
  }

  async getAllUsers(): Promise<UserAccount[]> {
    const userResults = await this.usersRepository.find();
    return userResults;
  }

  async deleteUser(id: string): Promise<any> {
    const tx = async (
      transactionManager: EntityManager,
    ): Promise<[number, number]> => {
      const { affected: authsAffected } = await transactionManager.delete(
        UserAuth,
        {
          userAccount: {
            id,
          },
        },
      );
      const { affected: usersAffected } = await transactionManager.delete(
        UserAccount,
        {
          id,
        },
      );
      return [usersAffected || 0, authsAffected || 0];
    };
    const [usersAffected] = await this.entityManager.transaction(tx);

    return usersAffected;
  }
}
