import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 创建文章基础内容请求体
 */
export class ArticleCreateBodyDto {
  @ApiProperty({ description: '文章标题', example: '文章标题' })
  @MaxLength(100, { message: '文章标题长度不能超过100个字符' })
  @IsString({ message: '文章标题必须是字符串' })
  @IsNotEmpty({ message: '文章标题不能为空' })
  title: string;

  @ApiProperty({ description: '文章内容', example: '文章内容' })
  @IsString({ message: '文章内容必须是字符串' })
  @IsNotEmpty({ message: '文章内容不能为空' })
  content: string;
}
