import {
  Controller,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard, CurrentUser } from '@/common/jwt';
import { UserEntity } from '@/admin/user/entities';
import { AssetService } from '../services';
import { FileValidationPipe } from '../pipes';
import { AssetImageDto } from '../dtos';

@Controller('admin/asset')
@ApiTags('资产管理模块')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload/image')
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: '上传图片' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '上传图片成功',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '上传图片失败',
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @CurrentUser() user: UserEntity,
    @UploadedFile(new FileValidationPipe()) file: Express.Multer.File,
  ): Promise<AssetImageDto> {
    return await this.assetService.uploadImage(user, file);
  }
}
