import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { AuthType, UserAccount, UserAuth } from 'src/model/user.entity';
import { EntityManager, Repository } from 'typeorm';
import * as xid from 'xid';

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
  ): Promise<UserAccount> {
    console.log(userId);
    const authToSave = new UserAuth();
    authToSave.id = xid.generateId();
    const userToSave = new UserAccount();
    userToSave.id = xid.generateId();
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

  async getAllUsers(): Promise<UserAccount[]> {
    const userResults = await this.usersRepository.find();
    return userResults;
  }

  async deleteUser(id: string): Promise<any> {
    const tx = async (
      transactionManager: EntityManager,
    ): Promise<[number, number]> => {
      const { affected: authAffected } = await transactionManager.delete(
        UserAuth,
        {
          userAccount: {
            id,
          },
        },
      );
      const { affected: userAffected } = await transactionManager.delete(
        UserAccount,
        {
          id,
        },
      );
      return [userAffected || 0, authAffected || 0];
    };
    const [userAffected] = await this.entityManager.transaction(tx);

    return userAffected;
  }
}
