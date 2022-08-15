import { IsEmail, IsPhoneNumber } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum AuthType {
  EMAIL = 'EMAIL',
  PHONE_NUMBER = 'PHONE_NUMBER',
  FIREBASE = 'FIREBASE',
  UNKNOWN = 'UNKNOWN',
}

@Entity()
export class UserAccount {
  @PrimaryColumn({
    type: 'string',
    unique: true,
  })
  id: string;

  @Column({
    type: 'string',
    nullable: true,
    unique: true,
  })
  @IsEmail()
  email?: string;

  @Column({
    type: 'string',
    nullable: true,
    unique: true,
  })
  @IsPhoneNumber()
  phoneNumber?: string;

  @Column({
    type: 'boolean',
    nullable: true,
    default: false,
  })
  onboarded?: boolean;

  @Column({
    type: 'string',
    nullable: true,
  })
  name?: string;

  @Column({
    type: 'string',
    nullable: true,
  })
  displayName?: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @OneToMany(() => UserAuth, (auth) => auth.userAccount)
  auths?: UserAuth[];
}

@Index(['authType', 'externalId'])
@Index(['authType', 'userId'])
@Entity()
export class UserAuth {
  @PrimaryColumn({
    type: 'string',
    unique: true,
  })
  id: string;

  @ManyToOne(() => UserAccount, (account) => account.auths, { cascade: true })
  userAccount: UserAccount;

  @Column({
    type: 'string',
    nullable: true,
  })
  @Index()
  externalId?: string;

  @Column({
    type: 'string',
    nullable: true,
  })
  @Index()
  userId?: string;

  @Column({
    type: 'string',
    enum: AuthType,
    default: AuthType.UNKNOWN,
  })
  authType: AuthType;
}
