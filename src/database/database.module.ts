import { RootConfigModule } from '@config/module';
import { CockroachConfig } from '@config/types';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccount, UserAuth } from 'src/model/user.entity';

@Module({
  imports: [
    RootConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const options = configService.get<CockroachConfig>(
          `${process.env.NODE_ENV}.cockroach`,
        );
        return {
          ...options,
          type: 'cockroachdb',
          synchronize: true,
          autoLoadEntities: true,
          entities: [UserAccount, UserAuth],
          username: 'root',
          database: 'defaultdb',
        };
      },
    }),
  ],
})
export class DatabaseModule {}
