import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@/admin/user/entities';
import { ArticleEntity } from '../entities';

@Injectable()
export class ArticleRepository {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly repository: Repository<ArticleEntity>,
  ) {}

  getRepository(): Repository<ArticleEntity> {
    return this.repository;
  }

  save(article: ArticleEntity): Promise<ArticleEntity> {
    return this.repository.save(article);
  }
}
