import { Injectable } from '@nestjs/common';
import { UserEntity } from '@/admin/user/entities';
import { StatisticsRepository } from '../repositories';
import {
  StatisticsSummaryDto,
  StatisticsHeatmapDto,
  HeatmapItemDto,
  StatisticsTagDistributionDto,
  TagDistributionItemDto,
} from '../dtos';
import { removeMarkdownTag, formatDate } from '@/utils';

@Injectable()
export class StatisticsService {
  constructor(private readonly statisticsRepository: StatisticsRepository) {}

  /**
   * 获取统计汇总信息
   * 包括：坚持连续发笔记天数、总笔记字数、7天发笔记数、7天笔记环比、当天发笔记字数、环比昨天发笔记字数
   */
  async getStatisticsSummary(user: UserEntity): Promise<StatisticsSummaryDto> {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const fourteenDaysAgo = new Date(today);
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    // 获取所有已发布的文章
    const allArticles =
      await this.statisticsRepository.findPublishedArticlesByUser(user);

    // 计算总笔记字数
    const totalWords = allArticles.reduce((sum, article) => {
      return sum + removeMarkdownTag(article.content).length;
    }, 0);

    // 计算连续发笔记天数
    const consecutiveDays = this.calculateConsecutiveDays(
      allArticles.map((article) => article.publishedAt!),
    );

    // 获取最近7天的文章
    const articlesLast7Days =
      await this.statisticsRepository.findPublishedArticlesByUserAndDateRange(
        user,
        sevenDaysAgo,
        today,
      );
    const notesLast7Days = articlesLast7Days.length;

    // 获取前7天的文章（用于计算环比）
    const articlesPrevious7Days =
      await this.statisticsRepository.findPublishedArticlesByUserAndDateRange(
        user,
        fourteenDaysAgo,
        sevenDaysAgo,
      );
    const notesPrevious7Days = articlesPrevious7Days.length;

    // 计算7天笔记环比
    const notesLast7DaysGrowthRate =
      notesPrevious7Days === 0
        ? notesLast7Days > 0
          ? 100
          : 0
        : ((notesLast7Days - notesPrevious7Days) / notesPrevious7Days) * 100;

    // 获取当天的文章
    const todayArticles =
      await this.statisticsRepository.findPublishedArticlesByUserAndDate(
        user,
        today,
      );
    const todayWords = todayArticles.reduce((sum, article) => {
      return sum + removeMarkdownTag(article.content).length;
    }, 0);

    // 获取昨天的文章
    const yesterdayArticles =
      await this.statisticsRepository.findPublishedArticlesByUserAndDate(
        user,
        yesterday,
      );
    const yesterdayWords = yesterdayArticles.reduce((sum, article) => {
      return sum + removeMarkdownTag(article.content).length;
    }, 0);

    // 计算环比昨天发笔记字数
    const todayWordsGrowthRate =
      yesterdayWords === 0
        ? todayWords > 0
          ? 100
          : 0
        : ((todayWords - yesterdayWords) / yesterdayWords) * 100;

    return {
      consecutiveDays,
      totalWords,
      notesLast7Days,
      notesLast7DaysGrowthRate:
        Math.round(notesLast7DaysGrowthRate * 100) / 100,
      todayWords,
      todayWordsGrowthRate: Math.round(todayWordsGrowthRate * 100) / 100,
    };
  }

  /**
   * 获取全年每天笔记数量热力图数据
   */
  async getStatisticsHeatmap(
    user: UserEntity,
    year: number,
  ): Promise<StatisticsHeatmapDto> {
    const startDate = new Date(year, 0, 1); // 1月1日
    const endDate = new Date(year + 1, 0, 1); // 下一年的1月1日

    // 获取该年每天的笔记数量
    const dailyCounts =
      await this.statisticsRepository.getDailyArticleCountsByUser(
        user,
        startDate,
        endDate,
      );

    // 将结果转换为Map以便快速查找
    const countsMap = new Map<string, number>();
    dailyCounts.forEach((item) => {
      countsMap.set(formatDate(item.date), item.count);
    });

    // 生成全年365/366天的数据（包括没有笔记的日期）
    const data: HeatmapItemDto[] = [];
    const currentDate = new Date(startDate);
    while (currentDate < endDate) {
      const dateStr = formatDate(currentDate);
      data.push({
        date: dateStr,
        count: countsMap.get(dateStr) || 0,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return {
      year,
      data,
    };
  }

  /**
   * 获取每个标签分布笔记数环形图数据
   */
  async getStatisticsTagDistribution(
    user: UserEntity,
  ): Promise<StatisticsTagDistributionDto> {
    // 获取每个标签的文章数量
    const tagCounts =
      await this.statisticsRepository.getTagArticleCountsByUser(user);

    // 获取总文章数
    const totalArticles =
      await this.statisticsRepository.getTotalPublishedArticlesCountByUser(
        user,
      );

    // 计算每个标签的占比
    const data: TagDistributionItemDto[] = tagCounts.map((item) => ({
      tagId: item.tagId,
      tagName: item.tagName,
      count: item.count,
      percentage:
        totalArticles === 0
          ? 0
          : Math.round((item.count / totalArticles) * 100 * 100) / 100,
    }));

    return {
      data,
      totalArticles,
    };
  }

  /**
   * 计算连续发笔记天数
   * @param publishedDates 已发布文章的发布日期数组
   * @returns 连续天数
   */
  private calculateConsecutiveDays(publishedDates: Date[]): number {
    if (publishedDates.length === 0) {
      return 0;
    }

    // 获取唯一的日期（去除时间部分）
    const uniqueDates = new Set<string>();
    publishedDates.forEach((date) => {
      const dateStr = formatDate(date);
      uniqueDates.add(dateStr);
    });

    if (uniqueDates.size === 0) {
      return 0;
    }

    // 计算连续天数
    let consecutiveDays = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 检查今天是否有发笔记
    const todayStr = formatDate(today);
    let startDate = new Date(today);
    if (!uniqueDates.has(todayStr)) {
      // 如果今天没有发笔记，从昨天开始计算
      startDate.setDate(startDate.getDate() - 1);
    }

    // 从开始日期往前推，连续检查每一天
    let currentDate = new Date(startDate);
    while (true) {
      const currentDateStr = formatDate(currentDate);
      if (uniqueDates.has(currentDateStr)) {
        consecutiveDays++;
        // 往前推一天
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        // 如果某一天没有发笔记，停止计算
        break;
      }
    }

    return consecutiveDays;
  }
}
