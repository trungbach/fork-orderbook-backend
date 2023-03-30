import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { CrawlRpcService, TypeEventWasm } from './services';
import { HomeController, ProductController } from './controllers';
import { CosmosModule } from '../cosmos/cosmos.module';

@Module({
  controllers: [HomeController, ProductController],
  providers: [CrawlRpcService, TypeEventWasm],
  imports: [
    CosmosModule,
    BullModule.registerQueue({
      name: 'order-queue',
    }),
  ],
  exports: [CrawlRpcService, TypeEventWasm],
})
export class CrawlRpcModule {}
