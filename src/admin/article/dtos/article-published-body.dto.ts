import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ArticleStatus } from '../entities';

export class ArticlePublishedBodyDto {
  @ApiProperty({ description: '文章标题', example: '文章标题' })
  @MaxLength(100, { message: '文章标题长度不能超过100个字符' })
  @IsString({ message: '文章标题必须是字符串' })
  @IsNotEmpty({ message: '文章标题不能为空' })
  title: string;

  @ApiProperty({ description: '文章简介', example: '文章简介' })
  @MaxLength(500, { message: '文章简介长度不能超过500个字符' })
  @IsString({ message: '文章简介必须是字符串' })
  @IsOptional()
  summary?: string;

  @ApiProperty({ description: '文章内容', example: '文章内容' })
  @IsString({ message: '文章内容必须是字符串' })
  @IsNotEmpty({ message: '文章内容不能为空' })
  content: string;

  @ApiProperty({ description: '文章封面图', example: '文章封面图' })
  @IsString({ message: '文章封面图必须是字符串' })
  @IsOptional()
  coverId?: string;

  @ApiProperty({ description: '文章标签', example: ['标签1', '标签2'] })
  @IsArray({ message: '文章标签必须是数组' })
  @IsOptional()
  tagIds?: string[];

  @ApiProperty({ description: '文章状态', example: 'DRAFT' })
  @IsEnum(ArticleStatus, { message: '文章状态必须是枚举值' })
  @IsOptional()
  status?: ArticleStatus;

  @ApiProperty({
    description: '文章定时发布时间',
    example: '2025-01-01 00:00:00',
  })
  @IsDateString({}, { message: '文章定时发布时间必须是日期字符串' })
  @IsOptional()
  publishedAt?: string;
}
