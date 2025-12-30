import { Module } from '@nestjs/common';
import { AuthModule } from './auth';
import { UserModule } from './user';
import { AssetModule } from './asset';

@Module({
  imports: [AuthModule, UserModule, AssetModule],
})
export class AdminModule {}
