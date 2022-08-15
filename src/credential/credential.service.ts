import { TTLCache } from '@brokerloop/ttlcache';
import { CredentialConfig, CredentialType } from '@config/types';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { get } from 'lodash';
import { resolve } from 'path';

@Injectable()
export class CredentialService {
  private secretManager: SecretManagerServiceClient;
  private secretManagerCache: TTLCache<string, any>;
  constructor() {
    this.secretManager = new SecretManagerServiceClient();
    this.secretManagerCache = new TTLCache<string, any>({
      ttl: 15 * 60 * 1000,
      max: 100,
    });
  }

  async getCredentials(
    config: CredentialConfig,
  ): Promise<Record<string, any> | any> {
    const { type, path, key } = config;
    let record: Record<string, any> = {};
    switch (type) {
      case CredentialType.FILE:
        record = yaml.load(
          readFileSync(resolve(__dirname, '../', path), 'utf-8'),
        ) as Record<string, any>;
        break;
      case CredentialType.SECRET_MANAGER:
        if (this.secretManagerCache.has(path)) {
          record = this.secretManagerCache.get(path);
        } else {
          const [secret] = await this.secretManager.accessSecretVersion({
            name: path,
          });
          if (secret && secret.payload && secret.payload.data) {
            record = yaml.load(secret.payload?.data?.toString()) as Record<
              string,
              any
            >;
            this.secretManagerCache.set(path, record);
          }
        }
        break;
      default:
        record = {};
        break;
    }
    return get(record, key || '', record);
  }
}
