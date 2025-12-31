import {
  Controller,
  Get,
  UseGuards,
  HttpStatus,
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
import { StatisticsService } from '../services';
import {
  StatisticsSummaryDto,
  StatisticsHeatmapDto,
  StatisticsTagDistributionDto,
  StatisticsHeatmapQueryDto,
} from '../dtos';

@Controller('admin/statistics')
@ApiTags('统计模块')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('summary')
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: '获取统计汇总信息' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '获取统计汇总信息成功',
    type: StatisticsSummaryDto,
  })
  async getStatisticsSummary(
    @CurrentUser() user: UserEntity,
  ): Promise<StatisticsSummaryDto> {
    return await this.statisticsService.getStatisticsSummary(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('heatmap')
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: '获取全年每天笔记数量热力图数据' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '获取热力图数据成功',
    type: StatisticsHeatmapDto,
  })
  async getStatisticsHeatmap(
    @CurrentUser() user: UserEntity,
    @Query() query: StatisticsHeatmapQueryDto,
  ): Promise<StatisticsHeatmapDto> {
    // 如果没有提供年份，使用当前年份
    const targetYear = query.year || new Date().getFullYear();
    return await this.statisticsService.getStatisticsHeatmap(user, targetYear);
  }

  @UseGuards(JwtAuthGuard)
  @Get('tag-distribution')
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: '获取每个标签分布笔记数环形图数据' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '获取标签分布数据成功',
    type: StatisticsTagDistributionDto,
  })
  async getStatisticsTagDistribution(
    @CurrentUser() user: UserEntity,
  ): Promise<StatisticsTagDistributionDto> {
    return await this.statisticsService.getStatisticsTagDistribution(user);
  }
}

