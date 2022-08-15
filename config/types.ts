export enum CredentialType {
  FILE = 'file',
  SECRET_MANAGER = 'secret_manager',
}

export interface CredentialConfig {
  readonly type: CredentialType;
  readonly path: string;
  readonly key?: string;
}

export interface CockroachConfig {
  readonly host: string;
  readonly port: number;
  readonly secure: boolean;
  readonly synchronize: boolean;
  readonly logging: boolean;
  readonly entities: string[];
  readonly database: string;
  readonly credentials: CredentialConfig;
}
