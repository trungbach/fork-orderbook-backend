import { Module } from '@nestjs/common';
import { CrawlRpcModule } from 'src/modules/crawl-rpc/crawl-rpc.module';
import { SeedCmd, ScanBlock } from './provider';

@Module({
  controllers: [],
  providers: [SeedCmd, ScanBlock],
  imports: [CrawlRpcModule],
})
export class CommandModule {}
