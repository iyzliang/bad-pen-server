import {
  Controller,
  Get,
  BadRequestException,
  Query,
  ParseFloatPipe,
} from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get('app')
  getHello(@Query('num', ParseFloatPipe) num: number): string {
    try {
      return num.toFixed(2);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
