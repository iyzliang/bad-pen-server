import { GeneralPaginationQueryDto } from '@/dtos';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { ArticleStatus } from '../entities';

export class ArticleListQueryDto extends GeneralPaginationQueryDto {
  @ApiProperty({
    description: '关键词,可以是标题或内容关键词',
    example: '测试',
  })
  @IsString()
  @IsOptional()
  keyword?: string;

  @ApiProperty({ description: '标签ID', example: '1' })
  @IsString()
  @IsOptional()
  tagId?: string;

  @ApiProperty({ description: '状态', example: 'DRAFT' })
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsEnum(ArticleStatus, { message: '状态必须是枚举值' })
  @IsOptional()
  status?: ArticleStatus;
}
