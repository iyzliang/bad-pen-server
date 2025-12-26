import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from '@/admin/user/entities';
import { AssetRepository } from '@/admin/asset/repositories';
import { TagRepository } from '@/admin/tag/repositories';
import { TagEntity } from '@/admin/tag/entities';
import { removeMarkdownTag } from '@/utils';
import { ArticleRepository } from '../repositories';
import { ArticleEntity, ArticleStatus } from '../entities';
import { ArticleCreateBodyDto } from '../dtos';

@Injectable()
export class ArticleService {
  constructor(
    private readonly articleRepository: ArticleRepository,
    private readonly assetRepository: AssetRepository,
    private readonly tagRepository: TagRepository,
  ) {}

  async createArticle(
    user: UserEntity,
    articleCreateBodyDto: ArticleCreateBodyDto,
  ): Promise<void> {
    const { title, content } = articleCreateBodyDto;

    // 创建文章实体
    const article = new ArticleEntity();
    article.title = title;
    article.content = content;
    article.user = user;
    article.status = ArticleStatus.DRAFT;
    article.readingTimeMinutes = this.calculateReadingTime(content);

    // 保存文章
    await this.articleRepository.save(article);
  }

  /**
   * 计算阅读时间（分钟）
   */
  private calculateReadingTime(content: string): number {
    const wordsPerMinute = 500;
    const wordCount = removeMarkdownTag(content).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }
}
