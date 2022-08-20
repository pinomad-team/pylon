import { RootConfigModule } from '@config/module';
import { Module } from '@nestjs/common';
import { CredentialModule } from 'src/credential/credential.module';
import { FirebaseService } from './firebase.service';

@Module({
  imports: [RootConfigModule, CredentialModule],
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {}
