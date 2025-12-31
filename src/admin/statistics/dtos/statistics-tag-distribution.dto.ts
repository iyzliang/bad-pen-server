import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, IsArray } from 'class-validator';

export class TagDistributionItemDto {
  @ApiProperty({ description: '标签ID', example: 'uuid-string' })
  @IsString({ message: '标签ID必须是字符串' })
  @IsNotEmpty({ message: '标签ID不能为空' })
  tagId: string;

  @ApiProperty({ description: '标签名称', example: '技术' })
  @IsString({ message: '标签名称必须是字符串' })
  @IsNotEmpty({ message: '标签名称不能为空' })
  tagName: string;

  @ApiProperty({ description: '该标签下的笔记数量', example: 25 })
  @IsNumber({}, { message: '笔记数量必须是数字' })
  @IsNotEmpty({ message: '笔记数量不能为空' })
  count: number;

  @ApiProperty({ description: '占比（百分比）', example: 35.5 })
  @IsNumber({}, { message: '占比必须是数字' })
  @IsNotEmpty({ message: '占比不能为空' })
  percentage: number;
}

export class StatisticsTagDistributionDto {
  @ApiProperty({ description: '标签分布数据', type: [TagDistributionItemDto] })
  @IsArray({ message: '数据必须是数组' })
  @IsNotEmpty({ message: '数据不能为空' })
  data: TagDistributionItemDto[];

  @ApiProperty({ description: '总笔记数', example: 100 })
  @IsNumber({}, { message: '总笔记数必须是数字' })
  @IsNotEmpty({ message: '总笔记数不能为空' })
  totalArticles: number;
}

