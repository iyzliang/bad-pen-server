import { Module } from '@nestjs/common';
import { AuthModule } from './auth';
import { UserModule } from './user';
import { AssetModule } from './asset';
import { StatisticsModule } from './statistics';

@Module({
  imports: [AuthModule, UserModule, AssetModule, StatisticsModule],
})
export class AdminModule {}
