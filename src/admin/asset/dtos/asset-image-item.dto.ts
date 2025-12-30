import {
  IsString,
  IsNotEmpty,
  IsUrl,
  IsUUID,
  IsNumber,
  IsDate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { formatDateTime } from '@/utils';
import { AssetEntity } from '../entities';

export class AssetImageItemDto {
  @ApiProperty({ description: '图片ID' })
  @IsUUID('4')
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: '图片URL' })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @ApiProperty({ description: '图片名称' })
  @IsString()
  @IsNotEmpty()
  filename: string;

  @ApiProperty({ description: '图片MIME类型' })
  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @ApiProperty({ description: '图片大小' })
  @IsNumber()
  @IsNotEmpty()
  size: number;

  @ApiProperty({ description: '创建时间' })
  @IsDate()
  @IsNotEmpty()
  createdAt: string;

  constructor(asset: AssetEntity) {
    this.id = asset.id;
    this.url = asset.url;
    this.filename = asset.filename;
    this.mimeType = asset.mimeType ?? '';
    this.size = asset.size;
    this.createdAt = formatDateTime(asset.createdAt);
  }
}
