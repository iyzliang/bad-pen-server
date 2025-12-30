import { ApiProperty } from '@nestjs/swagger';
import { TagItemDto } from '@/admin/tag/dtos/tag-item.dto';
import { AssetImageDto } from '@/admin/asset/dtos';
import { TagEntity } from '@/admin/tag/entities';
import { formatDateTime } from '@/utils';
import { ArticleStatus, ArticleEntity } from '../entities';

export class ArticleGetDto {
  @ApiProperty({ description: '文章ID' })
  id: string;

  @ApiProperty({ description: '文章标题' })
  title: string;

  @ApiProperty({ description: '文章简介' })
  summary: string | null;

  @ApiProperty({ description: '文章封面图' })
  cover: AssetImageDto | null;

  @ApiProperty({ description: '文章内容' })
  content: string;

  @ApiProperty({ description: '标签' })
  tags: TagItemDto[];

  @ApiProperty({ description: '状态' })
  status: ArticleStatus;

  @ApiProperty({ description: '定时发布时间' })
  publishedAt: string | null;

  @ApiProperty({ description: '创建时间' })
  createdAt: string;

  constructor(article: ArticleEntity) {
    this.id = article.id;
    this.title = article.title;
    this.summary = article.summary ?? null;
    this.cover = article.cover ? new AssetImageDto(article.cover) : null;
    this.content = article.content;
    this.tags = article.tags.map((tag: TagEntity) => new TagItemDto(tag));
    this.status = article.status;
    this.publishedAt = article.publishedAt
      ? formatDateTime(article.publishedAt)
      : null;
    this.createdAt = formatDateTime(article.createdAt);
  }
}
