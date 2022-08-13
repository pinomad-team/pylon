import { Module } from '@nestjs/common';
import { WebController } from './web.controller';

@Module({
  imports: [],
  controllers: [WebController],
})
export class WebModule {}
