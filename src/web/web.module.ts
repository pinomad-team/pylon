import { Module } from '@nestjs/common';
import { RootConfigModule } from '@config/module';
import { WebController } from './web.controller';
import { WebService } from './web.service';

@Module({
  imports: [RootConfigModule],
  controllers: [WebController],
  providers: [WebService],
})
export class WebModule {}
