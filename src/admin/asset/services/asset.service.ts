import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from '@/admin/user/entities';
import { AssetRepository } from '../repositories';
import { CosService } from './cos.service';
import {
  AssetImageDto,
  AssetImageItemDto,
  AssetImageListQueryDto,
  AssetImageListDto,
} from '../dtos';

@Injectable()
export class AssetService {
  constructor(
    private readonly assetRepository: AssetRepository,
    private readonly cosService: CosService,
  ) {}

  /**
   * 上传图片
   * @param user 用户
   * @param file 文件
   * @returns 图片信息
   */
  async uploadImage(
    user: UserEntity,
    file: Express.Multer.File,
  ): Promise<AssetImageDto> {
    const url = await this.cosService.uploadImage(file);
    const asset = await this.assetRepository.create({
      url,
      filename: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      user,
    });
    return new AssetImageDto(asset);
  }

  /**
   * 获取图片列表
   * @param user 用户
   * @param imageListQuery 图片列表查询条件
   * @returns 图片列表
   */
  async getImages(
    user: UserEntity,
    imageListQuery: AssetImageListQueryDto,
  ): Promise<AssetImageListDto> {
    const { page = 1, limit = 10 } = imageListQuery;
    const [assets, total] = await this.assetRepository.findDataAndTotalByUser(
      user,
      imageListQuery,
    );

    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      result: assets.map((asset) => new AssetImageItemDto(asset)),
    };
  }

  /**
   * 删除图片
   * @param user 用户
   * @param id 图片ID
   * @returns 是否删除成功
   */
  async deleteImage(user: UserEntity, id: string): Promise<void> {
    // 查找资产并验证用户权限
    const asset = await this.assetRepository.findByIdAndUser(id, user);
    if (!asset) {
      throw new NotFoundException('图片不存在，删除失败');
    }
    // 执行软删除
    await this.assetRepository.softDelete(id);
  }
}
