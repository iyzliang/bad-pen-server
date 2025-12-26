import { IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GeneralPaginationDto {
  @ApiProperty({ description: '页码', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  page: number;

  @ApiProperty({ description: '每页条数', example: 10 })
  @IsNumber()
  @IsNotEmpty()
  limit: number;

  @ApiProperty({ description: '总条数', example: 100 })
  @IsNumber()
  @IsNotEmpty()
  total: number;

  @ApiProperty({ description: '总页数', example: 10 })
  @IsNumber()
  @IsNotEmpty()
  totalPages: number;
}
