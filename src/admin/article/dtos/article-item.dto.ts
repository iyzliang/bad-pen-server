import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { TagItemDto } from '@/admin/tag/dtos/tag-item.dto';
import { TagEntity } from '@/admin/tag/entities';
import { formatDateTime } from '@/utils/date.util';
import { ArticleStatus, ArticleEntity } from '../entities';

export class ArticleItemDto {
  @ApiProperty({ description: '文章ID' })
  @IsString({ message: '文章ID必须是字符串' })
  @IsNotEmpty({ message: '文章ID不能为空' })
  id: string;

  @ApiProperty({ description: '文章标题' })
  @IsString({ message: '文章标题必须是字符串' })
  @IsNotEmpty({ message: '文章标题不能为空' })
  title: string;

  @ApiProperty({ description: '文章内容' })
  @IsString({ message: '文章内容必须是字符串' })
  @IsNotEmpty({ message: '文章内容不能为空' })
  content: string;

  @ApiProperty({ description: '标签' })
  @IsArray({ message: '标签必须是数组' })
  @IsNotEmpty({ message: '标签不能为空' })
  tags: TagItemDto[];

  @ApiProperty({ description: '创建时间' })
  @IsDateString({}, { message: '创建时间必须是日期字符串' })
  @IsNotEmpty({ message: '创建时间不能为空' })
  createdAt: string;

  @ApiProperty({ description: '状态' })
  @IsEnum(ArticleStatus, { message: '状态必须是枚举值' })
  @IsNotEmpty({ message: '状态不能为空' })
  status: ArticleStatus;

  constructor(articleEntity: ArticleEntity) {
    this.id = articleEntity.id;
    this.title = articleEntity.title;
    this.content = articleEntity.content;
    this.tags = articleEntity.tags.map((tag: TagEntity) => new TagItemDto(tag));
    this.createdAt = formatDateTime(articleEntity.createdAt);
    this.status = articleEntity.status;
  }
}
