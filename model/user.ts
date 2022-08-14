import { IsEmail, IsPhoneNumber } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  Tree,
  TreeChildren,
  TreeParent,
  UpdateDateColumn,
} from 'typeorm';

export enum AuthType {
  EMAIL,
  PHONE_NUMBER,
  FIREBASE,
  UNKNOWN,
}

@Entity()
@Tree('closure-table')
export class User {
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
  onboarded: boolean;

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
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @TreeChildren()
  auths: UserAuth[];
}

@Entity()
@Tree('closure-table')
@Index(['externalId'])
export class UserAuth {
  @PrimaryColumn({
    type: 'string',
    unique: true,
  })
  id: string;

  @TreeParent()
  user: User;

  @Column({
    type: 'string',
  })
  @Index()
  externalId?: string;

  @Column({
    type: 'string',
  })
  @Index()
  userId?: string;

  @Column({
    type: 'enum',
    enum: AuthType,
    default: AuthType.UNKNOWN,
  })
  authType: AuthType;
}
