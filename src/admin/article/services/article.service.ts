import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UserEntity } from '@/admin/user/entities';
import { AssetRepository } from '@/admin/asset/repositories';
import { TagRepository } from '@/admin/tag/repositories';
import { removeMarkdownTag } from '@/utils';
import { ArticleRepository } from '../repositories';
import { ArticleEntity, ArticleStatus } from '../entities';
import {
  ArticleCreateBodyDto,
  ArticleItemDto,
  ArticleListQueryDto,
  ArticleListDto,
  ArticleGetDto,
  ArticlePublishBodyDto,
} from '../dtos';

@Injectable()
export class ArticleService {
  constructor(
    private readonly articleRepository: ArticleRepository,
    private readonly assetRepository: AssetRepository,
    private readonly tagRepository: TagRepository,
  ) {}

  /**
   * 创建文章
   * @param user 用户
   * @param articleCreateBodyDto 文章创建数据
   */
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
   * 获取文章列表
   * @param user 用户
   * @param articleListQuery 文章列表查询条件
   * @returns 文章列表
   */
  async getArticleList(
    user: UserEntity,
    articleListQuery: ArticleListQueryDto,
  ): Promise<ArticleListDto> {
    const { page = 1, limit = 10 } = articleListQuery;
    const [articles, total] = await this.articleRepository.findAllByUser(
      user,
      articleListQuery,
    );
    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      result: articles.map((article) => new ArticleItemDto(article)),
    };
  }

  /**
   * 获取文章详情
   * @param user 用户
   * @param id 文章ID
   * @returns 文章详情
   */
  async getArticleDetail(user: UserEntity, id: string): Promise<ArticleGetDto> {
    const article = await this.articleRepository.findByUserAndId(user, id);
    if (!article) {
      throw new NotFoundException('文章不存在');
    }
    return new ArticleGetDto(article);
  }

  /**
   * 发布文章
   * @param user 用户
   * @param id 文章ID
   * @param articlePublishBodyDto 文章发布数据
   */
  async publishArticle(
    user: UserEntity,
    id: string,
    articlePublishBodyDto: ArticlePublishBodyDto,
  ): Promise<void> {
    const { summary, coverId, tagIds, status, publishedAt } =
      articlePublishBodyDto;

    // 查找文章
    const article = await this.articleRepository.findByUserAndId(user, id);
    if (!article) {
      throw new NotFoundException('文章不存在');
    }

    // 验证文章状态：只能发布草稿文章
    if (article.status !== ArticleStatus.DRAFT) {
      throw new BadRequestException('只能发布草稿状态的文章');
    }

    // 更新文章简介
    if (summary !== undefined) {
      article.summary = summary;
    }

    // 更新封面图
    if (coverId !== undefined) {
      if (coverId) {
        const cover = await this.assetRepository.findByIdAndUser(coverId, user);
        if (!cover) {
          throw new NotFoundException('封面图不存在');
        }
        article.cover = cover;
      } else {
        article.cover = null;
      }
    }

    // 更新标签
    if (tagIds !== undefined) {
      if (tagIds && tagIds.length > 0) {
        // 验证所有标签是否存在且属于当前用户
        const tags = await Promise.all(
          tagIds.map((tagId) =>
            this.tagRepository.findByIdAndUser(tagId, user),
          ),
        );
        const invalidTags = tags.filter((tag) => !tag);
        if (invalidTags.length > 0) {
          throw new NotFoundException('部分标签不存在');
        }
        article.tags = tags.filter(
          (tag): tag is NonNullable<typeof tag> => tag !== null,
        );
      } else {
        article.tags = [];
      }
    }

    // 设置文章状态和发布时间
    const targetStatus = status || ArticleStatus.PUBLISHED;
    article.status = targetStatus;

    if (targetStatus === ArticleStatus.PUBLISHED) {
      // 立即发布：如果没有指定发布时间，使用当前时间
      article.publishedAt = publishedAt ? new Date(publishedAt) : new Date();
    } else if (targetStatus === ArticleStatus.SCHEDULED) {
      // 定时发布：必须提供发布时间
      if (!publishedAt) {
        throw new BadRequestException('定时发布必须指定发布时间');
      }
      article.publishedAt = new Date(publishedAt);
    }
    // 如果状态是 DRAFT，保持 publishedAt 原值（不更新）

    // 保存文章
    await this.articleRepository.save(article);
  }

  /**
   * 发布到期的定时发布文章
   * 将状态为 SCHEDULED 且 publishedAt 已到期的文章发布
   */
  async publishScheduledArticles(): Promise<void> {
    const now = new Date();
    const scheduledArticles =
      await this.articleRepository.findScheduledArticlesToPublish(now);

    for (const article of scheduledArticles) {
      article.status = ArticleStatus.PUBLISHED;
      // publishedAt 已经在设置定时发布时设置好了，这里不需要修改
      await this.articleRepository.save(article);
    }
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
