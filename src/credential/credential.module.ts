import { RootConfigModule } from '@config/module';
import { Module } from '@nestjs/common';
import { CredentialService } from './credential.service';

@Module({
  imports: [RootConfigModule],
  providers: [CredentialService],
  exports: [CredentialService],
})
export class CredentialModule {}
