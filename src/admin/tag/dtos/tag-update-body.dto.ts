import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TagUpdateBodyDto {
  @ApiProperty({ description: '标签名称', example: '标签1' })
  @IsNotEmpty()
  @IsString()
  name: string;
}
