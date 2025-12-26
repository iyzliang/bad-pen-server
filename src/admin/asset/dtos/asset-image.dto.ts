import { IsUUID, IsNotEmpty, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AssetEntity } from '../entities';

export class AssetImageDto {
  @ApiProperty({ description: '图片ID' })
  @IsUUID('4')
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: '图片URL' })
  @IsUrl()
  @IsNotEmpty()
  url: string;

  constructor(asset: AssetEntity) {
    Object.assign(this, asset);
  }
}
