/* eslint-disable */
import { Timestamp } from '../google/protobuf/timestamp';

export const protobufPackage = 'user';

export enum AuthType {
  UNKNOWN = 0,
  EMAIL = 1,
  PHONE_NUMBER = 2,
  FIREBASE = 3,
  UNRECOGNIZED = -1,
}

export interface User {
  id: string;
  onboarded?: boolean | undefined;
  name?: string | undefined;
  displayName?: string | undefined;
  userAuths: UserAuth[];
  createdAt: Timestamp | undefined;
  modifiedAt: Timestamp | undefined;
  email?: string | undefined;
  phoneNumber?: string | undefined;
}

export interface UserAuth {
  id: string;
  authType: AuthType;
  externalId?: string | undefined;
  userId?: string | undefined;
}

export const USER_PACKAGE_NAME = 'user';
