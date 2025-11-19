import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './decorators/public.decorator';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @ApiOperation({ summary: 'hello' })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
