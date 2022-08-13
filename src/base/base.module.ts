import { Module } from '@nestjs/common';
import { BaseController } from './base.controller';

@Module({
  imports: [],
  controllers: [BaseController],
})
export class BaseModule {}
