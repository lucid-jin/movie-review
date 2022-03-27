import { Module } from '@nestjs/common';
import { DBConfigService } from './config.service';

@Module({
  providers: [DBConfigService],
})
export class DBConfigModule {}
