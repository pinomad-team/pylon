export interface CockroachConfig {
  readonly host: string;
  readonly port: number;
  readonly secure: boolean;
  readonly synchronize: boolean;
  readonly logging: boolean;
  readonly entities: string[];
}
