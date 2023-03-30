import { Command, CommandRunner } from 'nest-commander';
import { CrawlRpcService } from 'src/modules/crawl-rpc/services';

@Command({ name: 'scan-block', description: 'scan-block' })
export class ScanBlock implements CommandRunner {
  constructor(private readonly crawlRpcServ: CrawlRpcService) {}

  async run(): Promise<void> {
    await this.crawlRpcServ.runMain();
  }
}
