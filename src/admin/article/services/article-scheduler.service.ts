import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ArticleService } from './article.service';

@Injectable()
export class ArticleSchedulerService {
  private readonly logger = new Logger(ArticleSchedulerService.name);

  constructor(private readonly articleService: ArticleService) {}

  /**
   * 每分钟检查一次到期的定时发布文章
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async handleScheduledArticles() {
    this.logger.log('开始检查到期的定时发布文章...');
    try {
      await this.articleService.publishScheduledArticles();
      this.logger.log('定时发布文章检查完成');
    } catch (error) {
      this.logger.error('发布定时文章时发生错误', error);
    }
  }
}

