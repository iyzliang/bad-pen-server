import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@/admin/user/entities';
import { ArticleEntity, ArticleStatus } from '../entities';
import { ArticleListQueryDto } from '../dtos';

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

  findAllByUser(
    user: UserEntity,
    articleListQuery: ArticleListQueryDto,
  ): Promise<[ArticleEntity[], number]> {
    const { page = 1, limit = 10, keyword, tagId, status } = articleListQuery;
    const queryBuilder = this.repository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.tags', 'tags')
      .where('article.userId = :userId', { userId: user.id })
      .andWhere('article.deletedAt IS NULL');

    // 关键词搜索（标题或内容）
    if (keyword) {
      queryBuilder.andWhere(
        '(article.title LIKE :keyword OR article.content LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    // 标签筛选
    if (tagId) {
      queryBuilder.andWhere('tags.id = :tagId', { tagId });
    }

    // 状态筛选
    if (status) {
      queryBuilder.andWhere('article.status = :status', { status });
    }

    return queryBuilder
      .orderBy('article.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
  }

  findByUserAndId(user: UserEntity, id: string): Promise<ArticleEntity | null> {
    return this.repository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.tags', 'tags')
      .leftJoinAndSelect('article.cover', 'cover')
      .where('article.userId = :userId', { userId: user.id })
      .andWhere('article.id = :id', { id })
      .andWhere('article.deletedAt IS NULL')
      .getOne();
  }

  /**
   * 查找所有到期的定时发布文章
   * @param now 当前时间
   * @returns 到期的文章列表
   */
  findScheduledArticlesToPublish(now: Date): Promise<ArticleEntity[]> {
    return this.repository
      .createQueryBuilder('article')
      .where('article.status = :status', { status: ArticleStatus.SCHEDULED })
      .andWhere('article.publishedAt <= :now', { now })
      .andWhere('article.deletedAt IS NULL')
      .getMany();
  }
}
