import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import COS from 'cos-nodejs-sdk-v5';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

@Injectable()
export class CosService {
  private cos: COS;

  constructor(private readonly configService: ConfigService) {}

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const domain = this.configService.get('COS_DOMAIN') as string;
    if (!domain) {
      throw new InternalServerErrorException('COS域名未配置');
    }
    const ext = path.extname(file.originalname);
    const newFileName = `${uuidv4()}${ext}`;
    const filePath = `images/${new Date().getFullYear()}/${new Date().getMonth() + 1}/${newFileName}`;
    await this.cosPutObject(filePath, file);
    return `${domain}/${filePath}`;
  }

  private getCos() {
    if (!this.cos) {
      const secretId = this.configService.get('COS_SECRET_ID') as string;
      const secretKey = this.configService.get('COS_SECRET_KEY') as string;
      if (!secretId || !secretKey) {
        throw new InternalServerErrorException('COS秘钥未配置');
      }
      this.cos = new COS({
        SecretId: secretId,
        SecretKey: secretKey,
      });
    }
    return this.cos;
  }

  private getCosConfig() {
    const bucket = this.configService.get<string>('COS_BUCKET') as string;
    const region = this.configService.get<string>('COS_REGION') as string;
    if (!bucket || !region) {
      throw new InternalServerErrorException('COS配置未配置');
    }
    return {
      bucket,
      region,
    };
  }

  private async cosPutObject(
    filePath: string,
    file: Express.Multer.File,
  ): Promise<COS.PutObjectResult> {
    const cos = this.getCos();
    const cosConfig = this.getCosConfig();
    return new Promise((resolve) => {
      cos.putObject(
        {
          Bucket: cosConfig.bucket,
          Region: cosConfig.region,
          Key: filePath,
          Body: file.buffer,
          ContentType: file.mimetype,
        },
        (err, data) => {
          if (err) {
            throw new InternalServerErrorException('上传图片失败');
          } else {
            resolve(data);
          }
        },
      );
    });
  }
}
