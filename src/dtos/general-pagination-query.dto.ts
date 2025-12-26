import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { ToNumber } from '@/common/decorators';

export class GeneralPaginationQueryDto {
  @ApiProperty({ description: '页码', example: 1 })
  @IsNumber()
  @IsOptional()
  @ToNumber(1)
  page?: number;

  @ApiProperty({ description: '每页条数', example: 10 })
  @IsNumber()
  @IsOptional()
  @ToNumber(10)
  limit?: number;
}
