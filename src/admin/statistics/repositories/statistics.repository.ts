import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@/admin/user/entities';
import { ArticleEntity, ArticleStatus } from '@/admin/article/entities';
import { TagEntity } from '@/admin/tag/entities';

@Injectable()
export class StatisticsRepository {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
  ) {}

  /**
   * 获取用户的已发布文章
   */
  async findPublishedArticlesByUser(user: UserEntity): Promise<ArticleEntity[]> {
    return this.articleRepository
      .createQueryBuilder('article')
      .where('article.userId = :userId', { userId: user.id })
      .andWhere('article.status = :status', { status: ArticleStatus.PUBLISHED })
      .andWhere('article.deletedAt IS NULL')
      .andWhere('article.publishedAt IS NOT NULL')
      .getMany();
  }

  /**
   * 获取用户在指定日期范围内的已发布文章
   */
  async findPublishedArticlesByUserAndDateRange(
    user: UserEntity,
    startDate: Date,
    endDate: Date,
  ): Promise<ArticleEntity[]> {
    return this.articleRepository
      .createQueryBuilder('article')
      .where('article.userId = :userId', { userId: user.id })
      .andWhere('article.status = :status', { status: ArticleStatus.PUBLISHED })
      .andWhere('article.deletedAt IS NULL')
      .andWhere('article.publishedAt >= :startDate', { startDate })
      .andWhere('article.publishedAt < :endDate', { endDate })
      .getMany();
  }

  /**
   * 获取用户在指定日期的已发布文章
   */
  async findPublishedArticlesByUserAndDate(
    user: UserEntity,
    date: Date,
  ): Promise<ArticleEntity[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.findPublishedArticlesByUserAndDateRange(
      user,
      startOfDay,
      endOfDay,
    );
  }

  /**
   * 获取用户每天的已发布文章数量（按日期分组）
   */
  async getDailyArticleCountsByUser(
    user: UserEntity,
    startDate: Date,
    endDate: Date,
  ): Promise<Array<{ date: string; count: number }>> {
    const result = await this.articleRepository
      .createQueryBuilder('article')
      .select('DATE(article.publishedAt)', 'date')
      .addSelect('COUNT(article.id)', 'count')
      .where('article.userId = :userId', { userId: user.id })
      .andWhere('article.status = :status', { status: ArticleStatus.PUBLISHED })
      .andWhere('article.deletedAt IS NULL')
      .andWhere('article.publishedAt >= :startDate', { startDate })
      .andWhere('article.publishedAt < :endDate', { endDate })
      .groupBy('DATE(article.publishedAt)')
      .orderBy('DATE(article.publishedAt)', 'ASC')
      .getRawMany();

    return result.map((item) => ({
      date: item.date,
      count: parseInt(item.count, 10),
    }));
  }

  /**
   * 获取每个标签下的文章数量
   */
  async getTagArticleCountsByUser(
    user: UserEntity,
  ): Promise<Array<{ tagId: string; tagName: string; count: number }>> {
    const result = await this.articleRepository
      .createQueryBuilder('article')
      .innerJoin('article.tags', 'tag')
      .select('tag.id', 'tagId')
      .addSelect('tag.name', 'tagName')
      .addSelect('COUNT(DISTINCT article.id)', 'count')
      .where('article.userId = :userId', { userId: user.id })
      .andWhere('article.status = :status', { status: ArticleStatus.PUBLISHED })
      .andWhere('article.deletedAt IS NULL')
      .andWhere('tag.deletedAt IS NULL')
      .groupBy('tag.id')
      .addGroupBy('tag.name')
      .orderBy('COUNT(DISTINCT article.id)', 'DESC')
      .getRawMany();

    return result.map((item) => ({
      tagId: item.tagId,
      tagName: item.tagName,
      count: parseInt(item.count, 10),
    }));
  }

  /**
   * 获取用户的总已发布文章数
   */
  async getTotalPublishedArticlesCountByUser(
    user: UserEntity,
  ): Promise<number> {
    return this.articleRepository
      .createQueryBuilder('article')
      .where('article.userId = :userId', { userId: user.id })
      .andWhere('article.status = :status', { status: ArticleStatus.PUBLISHED })
      .andWhere('article.deletedAt IS NULL')
      .getCount();
  }
}

