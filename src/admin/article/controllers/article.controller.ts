import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  UseGuards,
  HttpStatus,
  Param,
  Query,
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
import {
  ArticleCreateBodyDto,
  ArticleListQueryDto,
  ArticleListDto,
  ArticleGetDto,
  ArticlePublishBodyDto,
} from '../dtos';

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

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: '获取文章列表' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '获取文章列表成功',
    type: ArticleListDto,
  })
  async getArticleList(
    @CurrentUser() user: UserEntity,
    @Query() articleListQuery: ArticleListQueryDto,
  ): Promise<ArticleListDto> {
    return await this.articleService.getArticleList(user, articleListQuery);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: '获取文章详情' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '获取文章详情成功',
    type: ArticleGetDto,
  })
  async getArticleDetail(
    @CurrentUser() user: UserEntity,
    @Param('id') id: string,
  ): Promise<ArticleGetDto> {
    return await this.articleService.getArticleDetail(user, id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('publish/:id')
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: '发布文章' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '发布文章成功',
  })
  async publishArticle(
    @CurrentUser() user: UserEntity,
    @Param('id') id: string,
    @Body() articlePublishBodyDto: ArticlePublishBodyDto,
  ): Promise<void> {
    await this.articleService.publishArticle(user, id, articlePublishBodyDto);
  }
}
