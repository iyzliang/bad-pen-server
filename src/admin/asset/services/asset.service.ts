import { Injectable } from '@nestjs/common';
import { UserEntity } from '@/admin/user/entities';
import { AssetRepository } from '../repositories';
import { CosService } from './cos.service';
import { AssetImageDto } from '../dtos';

@Injectable()
export class AssetService {
  constructor(
    private readonly assetRepository: AssetRepository,
    private readonly cosService: CosService,
  ) {}

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
}
