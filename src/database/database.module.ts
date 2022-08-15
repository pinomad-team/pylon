import { RootConfigModule } from '@config/module';
import { CockroachConfig } from '@config/types';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CredentialModule } from 'src/credential/credential.module';
import { CredentialService } from 'src/credential/credential.service';
import { UserAccount, UserAuth } from 'src/model/user.entity';
import { CockroachConnectionOptions } from 'typeorm/driver/cockroachdb/CockroachConnectionOptions';

@Module({
  imports: [
    RootConfigModule,
    CredentialModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, CredentialModule],
      inject: [ConfigService, CredentialService],
      useFactory: async (
        configService: ConfigService,
        credentialService: CredentialService,
      ): Promise<CockroachConnectionOptions> => {
        const options = configService.get<CockroachConfig>(
          `${process.env.NODE_ENV || 'development'}.cockroach`,
        );
        const credentials = await credentialService.getCredentials(
          options!.credentials,
        );
        return {
          ...options,
          ...credentials,
          type: 'cockroachdb',
          ssl: !!options?.secure,
          synchronize: true,
          entities: [UserAccount, UserAuth],
          database: options?.database,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
