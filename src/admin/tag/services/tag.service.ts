import { BadRequestException, Injectable } from '@nestjs/common';
import { UserEntity } from '@/admin/user/entities';
import { TagRepository } from '../repositories';
import { TagCreateBodyDto, TagItemDto, TagUpdateBodyDto } from '../dtos';
import { TagEntity } from '../entities';

@Injectable()
export class TagService {
  constructor(private readonly tagRepository: TagRepository) {}

  /**
   * 创建标签
   * @param user 用户
   * @param tagCreateBodyDto 标签创建请求体
   * @returns 是否创建成功
   */
  async createTag(
    user: UserEntity,
    tagCreateBodyDto: TagCreateBodyDto,
  ): Promise<void> {
    const { name } = tagCreateBodyDto;
    if (!name || name.trim() === '') {
      throw new BadRequestException('标签名称不能为空');
    }
    const tag = await this.tagRepository.findByNameAndUser(name, user);
    if (tag) {
      throw new BadRequestException('标签已存在');
    }
    const tagEntity = new TagEntity();
    tagEntity.name = name;
    tagEntity.user = user;
    await this.tagRepository.save(tagEntity);
  }

  /**
   * 获取标签列表
   * @param user 用户
   * @returns 标签列表
   */
  async getTags(user: UserEntity): Promise<TagItemDto[]> {
    const tags = await this.tagRepository.findAllByUser(user);
    return tags.map((tag) => new TagItemDto(tag));
  }

  /**
   * 更新标签
   * @param user 用户
   * @param id 标签ID
   * @param tagUpdateBodyDto 标签更新请求体
   * @returns 是否更新成功
   */
  async updateTag(
    user: UserEntity,
    id: string,
    tagUpdateBodyDto: TagUpdateBodyDto,
  ): Promise<void> {
    const { name } = tagUpdateBodyDto;
    if (!name || name.trim() === '') {
      throw new BadRequestException('标签名称不能为空');
    }
    const tag = await this.tagRepository.findByIdAndUser(id, user);
    if (!tag) {
      throw new BadRequestException('标签不存在');
    }
    const nameTag = await this.tagRepository.findByNameAndUser(name, user);
    if (nameTag) {
      throw new BadRequestException('标签名称已存在');
    }
    await this.tagRepository.updateById(id, { name });
  }

  /**
   * 删除标签
   * @param user 用户
   * @param id 标签ID
   * @returns 是否删除成功
   */
  async deleteTag(user: UserEntity, id: string): Promise<void> {
    const tag = await this.tagRepository.findByIdAndUser(id, user);
    if (!tag) {
      throw new BadRequestException('标签不存在');
    }
    await this.tagRepository.deleteByIdAndUser(id, user);
  }
}
