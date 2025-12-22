import {
  Controller,
  Get,
  InternalServerErrorException,
  HttpStatus,
} from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get('app')
  getHello(): string {
    throw new InternalServerErrorException('bad request');
  }
}
