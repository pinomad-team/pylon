import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CredentialService } from 'src/credential/credential.service';
import {
  initializeApp,
  App,
  applicationDefault,
  Credential as FirebaseCredential,
  cert,
} from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { config } from 'process';
import { FirebaseConfig } from '@config/types';

@Injectable()
export class FirebaseService {
  private firebaseApp: App;
  constructor(
    private readonly configService: ConfigService,
    private readonly credentialService: CredentialService,
  ) {}

  private async getCredentials(): Promise<FirebaseCredential> {
    const options = this.configService.get<FirebaseConfig>(
      `${process.env.NODE_ENV || 'development'}.firebase`,
    );
    if (!options) {
      return applicationDefault();
    }
    const firebaseCredentials = await this.credentialService.getCredentials(
      options!.credentials,
    );
    return cert(firebaseCredentials);
  }

  async getFirebaseApp(): Promise<App> {
    if (!this.firebaseApp) {
      const credentials = await this.getCredentials();
      this.firebaseApp = initializeApp({
        credential: credentials,
      });
    }
    return this.firebaseApp;
  }

  async getAuth(): Promise<Auth> {
    const app = await this.getFirebaseApp();
    return getAuth(app);
  }
}
