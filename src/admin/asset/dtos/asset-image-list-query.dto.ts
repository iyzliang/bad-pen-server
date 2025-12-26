import { IsOptional, IsString } from 'class-validator';
import { GeneralPaginationQueryDto } from '@/dtos';
import { ApiProperty } from '@nestjs/swagger';

export class AssetImageListQueryDto extends GeneralPaginationQueryDto {
  @ApiProperty({ description: '关键词', example: '测试' })
  @IsString()
  @IsOptional()
  keyword?: string;
}
