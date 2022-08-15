import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { UserAccount, UserAuth } from 'src/model/user.entity';
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

  async createUser(): Promise<UserAccount> {
    const authToSave = new UserAuth();
    authToSave.id = xid.generateId();
    const userToSave = new UserAccount();
    userToSave.id = xid.generateId();
    const tx = async (
      transactionManager: EntityManager,
    ): Promise<[UserAccount, UserAuth]> => {
      const userResult = await transactionManager.save(userToSave);
      authToSave.userAccount = userResult;
      const authResult = await transactionManager.save(authToSave);
      return [userResult, authResult];
    };
    const [userResult] = await tx(this.entityManager);
    return userResult;
  }

  async getUser(id: string): Promise<UserAccount | null> {
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
}
