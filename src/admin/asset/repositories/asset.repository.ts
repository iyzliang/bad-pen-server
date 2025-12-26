import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@/admin/user/entities';
import { Repository } from 'typeorm';
import { AssetEntity } from '../entities';
import { AssetImageListQueryDto } from '../dtos';

@Injectable()
export class AssetRepository {
  constructor(
    @InjectRepository(AssetEntity)
    private readonly repository: Repository<AssetEntity>,
  ) {}

  getRepository(): Repository<AssetEntity> {
    return this.repository;
  }

  async create(assetData: Partial<AssetEntity>): Promise<AssetEntity> {
    return this.repository.save(assetData);
  }

  async update(id: string, assetData: Partial<AssetEntity>): Promise<void> {
    await this.repository.update(id, assetData);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  /**
   * 软删除资产
   * @param id 资产ID
   */
  async softDelete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }

  async findById(id: string): Promise<AssetEntity | null> {
    return this.repository.findOne({ where: { id } });
  }

  /**
   * 根据ID和用户查找资产（用于权限校验）
   * @param id 资产ID
   * @param user 用户
   * @returns 资产实体或null
   */
  async findByIdAndUser(
    id: string,
    user: UserEntity,
  ): Promise<AssetEntity | null> {
    return this.repository
      .createQueryBuilder('asset')
      .where('asset.id = :id', { id })
      .andWhere('asset.userId = :userId', { userId: user.id })
      .andWhere('asset.deletedAt IS NULL')
      .getOne();
  }

  async findDataAndTotalByUser(
    user: UserEntity,
    imageListQuery: AssetImageListQueryDto,
  ): Promise<[AssetEntity[], number]> {
    const { page = 1, limit = 10, keyword } = imageListQuery;
    const queryBuilder = this.repository
      .createQueryBuilder('asset')
      .where('asset.deletedAt IS NULL')
      .andWhere('asset.userId = :userId', { userId: user.id })
      .orderBy('asset.createdAt', 'DESC');
    if (keyword) {
      queryBuilder.andWhere('asset.filename LIKE :keyword', {
        keyword: `%${keyword}%`,
      });
    }
    return queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
  }
}
