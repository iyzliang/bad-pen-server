import { Controller, Get, BadRequestException, Query } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get('app')
  getHello(@Query('a') num: number): string {
    try {
      return num.toFixed(2);
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
