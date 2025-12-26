import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ASSET_MAX_SIZE, ASSET_ALLOWED_TYPES } from '@/common/constants';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  constructor() {}

  transform(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('请上传文件');
    }

    // 文件大小验证
    if (file.size > ASSET_MAX_SIZE) {
      throw new BadRequestException(
        `文件大小不能超过 ${ASSET_MAX_SIZE / 1024 / 1024}MB`,
      );
    }

    // 文件类型验证
    if (!ASSET_ALLOWED_TYPES.includes(file.mimetype)) {
      throw new BadRequestException('不支持的文件类型');
    }

    return file;
  }
}
