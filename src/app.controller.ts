import {
  Controller,
  Get,
  BadRequestException,
  Query,
  ParseFloatPipe,
} from '@nestjs/common';
import { RedisService } from '@/common/redis/redis.service';

@Controller()
export class AppController {
  constructor(private readonly redisService: RedisService) {}

  @Get('app')
  async getHello(@Query('num', ParseFloatPipe) num: number): Promise<string> {
    try {
      await this.redisService.set('test', `number is ${num}`);
      return num.toFixed(2);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get('test')
  async getTest(): Promise<string> {
    try {
      const cached = await this.redisService.get('test');
      return cached ?? 'not found';
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get('del')
  async delTest(): Promise<string> {
    try {
      await this.redisService.del('test');
      return 'deleted';
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
