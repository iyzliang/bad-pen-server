import {
  Controller,
  HttpStatus,
  Get,
  Post,
  Delete,
  Query,
  Param,
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
import {
  AssetImageDto,
  AssetImageListQueryDto,
  AssetImageListDto,
} from '../dtos';

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

  @UseGuards(JwtAuthGuard)
  @Get('images')
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: '获取图片列表' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '获取图片列表成功',
    type: AssetImageListDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '获取图片列表失败',
  })
  async getImages(
    @CurrentUser() user: UserEntity,
    @Query() imageListQuery: AssetImageListQueryDto,
  ): Promise<AssetImageListDto> {
    return await this.assetService.getImages(user, imageListQuery);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('image/:id')
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: '删除图片' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '删除图片成功',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '删除图片失败',
  })
  async deleteImage(
    @CurrentUser() user: UserEntity,
    @Param('id') id: string,
  ): Promise<void> {
    await this.assetService.deleteImage(user, id);
  }
}
