import {
  Controller,
  Get,
} from '@nestjs/common';
import config from 'src/config';
import { CrawlRpcService } from '../services';

@Controller('/')
export class HomeController {
  constructor(private readonly crawlRpcSerc: CrawlRpcService) { }

  @Get('/')
  index() {
    return `Start app orderbook: - env: ${config.APP_ENV} - isProd: ${config.isProd}`;
  }

  @Get('pair')
  async pairOne() {
    return this.crawlRpcSerc.getOnePair();
  }
}
