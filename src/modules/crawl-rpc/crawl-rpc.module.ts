import {  Module } from '@nestjs/common';
import { CrawlRpcService } from './services';
import { HomeController } from './controllers';

@Module({
  controllers: [HomeController],
  providers: [CrawlRpcService],
  imports: [],
})
export class CrawlRpcModule { }
