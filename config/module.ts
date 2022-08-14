import { ConfigModule } from '@nestjs/config';
import configuration from '@config/configuration';

export const RootConfigModule = ConfigModule.forRoot({
  load: [configuration],
});
