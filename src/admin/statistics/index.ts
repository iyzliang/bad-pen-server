import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ArticleEntity } from '@/admin/article/entities';
import { TagEntity } from '@/admin/tag/entities';
import { StatisticsController } from './controllers';
import { StatisticsService } from './services';
import { StatisticsRepository } from './repositories';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity, TagEntity]), JwtModule],
  controllers: [StatisticsController],
  providers: [StatisticsService, StatisticsRepository],
})
export class StatisticsModule {}
