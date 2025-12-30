import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ArticleEntity } from './entities';
import { ArticleController } from './controllers';
import {
  ArticleService,
  ArticleSchedulerService,
} from './services';
import { ArticleRepository } from './repositories';
import { AssetRepository } from '@/admin/asset/repositories';
import { TagRepository } from '@/admin/tag/repositories';
import { AssetEntity } from '@/admin/asset/entities';
import { TagEntity } from '@/admin/tag/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArticleEntity, AssetEntity, TagEntity]),
    JwtModule,
  ],
  controllers: [ArticleController],
  providers: [
    ArticleService,
    ArticleSchedulerService,
    ArticleRepository,
    AssetRepository,
    TagRepository,
  ],
})
export class ArticleModule {}
