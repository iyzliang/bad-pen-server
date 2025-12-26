import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpStatus,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard, CurrentUser } from '@/common/jwt';
import { UserEntity } from '@/admin/user/entities';
import { ArticleService } from '../services';
import { ArticleCreateBodyDto } from '../dtos';

@Controller('admin/article')
@ApiTags('文章管理模块')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: '创建文章' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '创建文章成功',
  })
  async createArticle(
    @CurrentUser() user: UserEntity,
    @Body() articleCreateBodyDto: ArticleCreateBodyDto,
  ): Promise<void> {
    await this.articleService.createArticle(user, articleCreateBodyDto);
  }
}
