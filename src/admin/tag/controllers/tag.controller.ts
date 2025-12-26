import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard, CurrentUser } from '@/common/jwt';
import { UserEntity } from '@/admin/user/entities';
import { TagService } from '../services';
import { TagCreateBodyDto, TagItemDto, TagUpdateBodyDto } from '../dtos';

@Controller('admin/tag')
@ApiTags('标签管理模块')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: '创建标签' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '创建标签成功',
  })
  async createTag(
    @CurrentUser() user: UserEntity,
    @Body() tagCreateBodyDto: TagCreateBodyDto,
  ): Promise<void> {
    await this.tagService.createTag(user, tagCreateBodyDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: '获取标签列表' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '获取标签列表成功',
    type: [TagItemDto],
  })
  async getTags(@CurrentUser() user: UserEntity): Promise<TagItemDto[]> {
    return this.tagService.getTags(user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: '删除标签' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '删除标签成功',
  })
  async deleteTag(
    @CurrentUser() user: UserEntity,
    @Param('id') id: string,
  ): Promise<void> {
    await this.tagService.deleteTag(user, id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: '更新标签' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '更新标签成功',
  })
  async updateTag(
    @CurrentUser() user: UserEntity,
    @Param('id') id: string,
    @Body() tagUpdateBodyDto: TagUpdateBodyDto,
  ): Promise<void> {
    await this.tagService.updateTag(user, id, tagUpdateBodyDto);
  }
}
