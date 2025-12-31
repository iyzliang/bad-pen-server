import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { ToNumber } from '@/common/decorators';

export class StatisticsHeatmapQueryDto {
  @ApiProperty({
    description: '年份（默认为当前年份）',
    required: false,
    example: 2025,
  })
  @IsNumber()
  @IsOptional()
  @ToNumber()
  year?: number;
}

