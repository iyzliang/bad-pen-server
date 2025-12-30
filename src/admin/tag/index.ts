import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { TagEntity } from './entities';
import { TagController } from './controllers';
import { TagService } from './services';
import { TagRepository } from './repositories';

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity]), JwtModule],
  controllers: [TagController],
  providers: [TagService, TagRepository],
})
export class TagModule {}
