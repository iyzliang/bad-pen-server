import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AssetEntity } from './entities';
import { AssetController } from './controllers';
import { AssetRepository } from './repositories';
import { AssetService, CosService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([AssetEntity]), JwtModule],
  controllers: [AssetController],
  providers: [AssetService, AssetRepository, CosService],
})
export class AssetModule {}
