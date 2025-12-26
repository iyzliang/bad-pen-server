import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { GeneralPaginationDto } from '@/dtos';
import { AssetImageItemDto } from './asset-image-item.dto';

export class AssetImageListDto extends GeneralPaginationDto {
  @ApiProperty({ description: '图片列表', type: [AssetImageItemDto] })
  @Type(() => AssetImageItemDto)
  result: AssetImageItemDto[];
}
