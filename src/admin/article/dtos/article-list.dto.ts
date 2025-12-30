import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { GeneralPaginationDto } from '@/dtos';
import { ArticleItemDto } from './article-item.dto';

export class ArticleListDto extends GeneralPaginationDto {
  @ApiProperty({ description: '文章列表', type: [ArticleItemDto] })
  @Type(() => ArticleItemDto)
  result: ArticleItemDto[];
}
