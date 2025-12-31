import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty } from 'class-validator';

export class StatisticsSummaryDto {
  @ApiProperty({ description: '坚持连续发笔记天数', example: 15 })
  @IsNumber({}, { message: '坚持连续发笔记天数必须是数字' })
  @IsNotEmpty({ message: '坚持连续发笔记天数不能为空' })
  consecutiveDays: number;

  @ApiProperty({ description: '总笔记字数', example: 50000 })
  @IsNumber({}, { message: '总笔记字数必须是数字' })
  @IsNotEmpty({ message: '总笔记字数不能为空' })
  totalWords: number;

  @ApiProperty({ description: '7天发笔记数', example: 7 })
  @IsNumber({}, { message: '7天发笔记数必须是数字' })
  @IsNotEmpty({ message: '7天发笔记数不能为空' })
  notesLast7Days: number;

  @ApiProperty({ description: '7天笔记环比（百分比，正数表示增长，负数表示下降）', example: 12.5 })
  @IsNumber({}, { message: '7天笔记环比必须是数字' })
  @IsNotEmpty({ message: '7天笔记环比不能为空' })
  notesLast7DaysGrowthRate: number;

  @ApiProperty({ description: '当天发笔记字数', example: 1500 })
  @IsNumber({}, { message: '当天发笔记字数必须是数字' })
  @IsNotEmpty({ message: '当天发笔记字数不能为空' })
  todayWords: number;

  @ApiProperty({ description: '环比昨天发笔记字数（百分比，正数表示增长，负数表示下降）', example: 10.5 })
  @IsNumber({}, { message: '环比昨天发笔记字数必须是数字' })
  @IsNotEmpty({ message: '环比昨天发笔记字数不能为空' })
  todayWordsGrowthRate: number;
}

