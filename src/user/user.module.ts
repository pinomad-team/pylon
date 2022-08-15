import { RootConfigModule } from '@config/module';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccount, UserAuth } from 'src/model/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserAccount, UserAuth]),
    RootConfigModule,
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
