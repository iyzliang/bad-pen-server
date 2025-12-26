import { Injectable } from '@nestjs/common';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@/admin/user/entities';
import { TagEntity } from '../entities';

@Injectable()
export class TagRepository {
  constructor(
    @InjectRepository(TagEntity)
    private readonly repository: Repository<TagEntity>,
  ) {}

  getRepository(): Repository<TagEntity> {
    return this.repository;
  }

  save(tagEntity: TagEntity): Promise<TagEntity> {
    return this.repository.save(tagEntity);
  }

  updateById(id: string, tagEntity: Partial<TagEntity>): Promise<UpdateResult> {
    return this.repository.update(id, tagEntity);
  }

  findByNameAndUser(name: string, user: UserEntity): Promise<TagEntity | null> {
    return this.repository
      .createQueryBuilder('tag')
      .where('tag.name = :name', { name })
      .andWhere('tag.userId = :userId', { userId: user.id })
      .andWhere('folder.deletedAt IS NULL')
      .getOne();
  }

  findAllByUser(user: UserEntity): Promise<TagEntity[]> {
    return this.repository
      .createQueryBuilder('tag')
      .where('tag.userId = :userId', { userId: user.id })
      .andWhere('tag.deletedAt IS NULL')
      .getMany();
  }

  findByIdAndUser(id: string, user: UserEntity): Promise<TagEntity | null> {
    return this.repository
      .createQueryBuilder('tag')
      .where('tag.id = :id', { id })
      .andWhere('tag.userId = :userId', { userId: user.id })
      .andWhere('tag.deletedAt IS NULL')
      .getOne();
  }

  deleteByIdAndUser(id: string, user: UserEntity): Promise<DeleteResult> {
    return this.repository
      .createQueryBuilder('tag')
      .delete()
      .where('tag.id = :id', { id })
      .andWhere('tag.userId = :userId', { userId: user.id })
      .execute();
  }
}
