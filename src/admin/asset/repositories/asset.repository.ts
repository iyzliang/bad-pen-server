import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssetEntity } from '../entities';

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

  async findById(id: string): Promise<AssetEntity | null> {
    return this.repository.findOne({ where: { id } });
  }
}
