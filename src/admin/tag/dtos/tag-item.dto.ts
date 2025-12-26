import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { TagEntity } from '../entities';

export class TagItemDto {
  @ApiProperty({
    description: '标签ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: '标签名称', example: '标签1' })
  @IsString()
  @IsNotEmpty()
  name: string;

  constructor(tagEntity: TagEntity) {
    this.id = tagEntity.id;
    this.name = tagEntity.name;
  }
}
