import {  Module } from '@nestjs/common';
import { CrawlRpcService } from './services';
import {
  HomeController,
  ProductController
} from './controllers';

@Module({
  controllers: [
    HomeController,
    ProductController
  ],
  providers: [
    CrawlRpcService
  ],
  imports: [],
})
export class CrawlRpcModule { }
