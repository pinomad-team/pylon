import { Metadata } from '@grpc/grpc-js';
import { forEach, startsWith, toLower } from 'lodash';

export const GRPC_HEADER_PREFIX = 'x-grpc';

export function generateGrpcMetadata(headers: Record<string, any> = {}) {
  const md = new Metadata();
  forEach(headers, (value: any, key: string) => {
    if (startsWith(toLower(key), GRPC_HEADER_PREFIX)) {
      md.set(key, value);
    }
  });
  return md;
}
