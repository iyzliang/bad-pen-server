import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, IsArray } from 'class-validator';

export class HeatmapItemDto {
  @ApiProperty({ description: '日期（YYYY-MM-DD格式）', example: '2025-01-01' })
  @IsString({ message: '日期必须是字符串' })
  @IsNotEmpty({ message: '日期不能为空' })
  date: string;

  @ApiProperty({ description: '该天的笔记数量', example: 3 })
  @IsNumber({}, { message: '笔记数量必须是数字' })
  @IsNotEmpty({ message: '笔记数量不能为空' })
  count: number;
}

export class StatisticsHeatmapDto {
  @ApiProperty({ description: '年份', example: 2025 })
  @IsNumber({}, { message: '年份必须是数字' })
  @IsNotEmpty({ message: '年份不能为空' })
  year: number;

  @ApiProperty({ description: '全年每天笔记数量数据', type: [HeatmapItemDto] })
  @IsArray({ message: '数据必须是数组' })
  @IsNotEmpty({ message: '数据不能为空' })
  data: HeatmapItemDto[];
}

