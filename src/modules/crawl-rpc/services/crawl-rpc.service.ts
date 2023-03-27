import {
  Injectable
} from '@nestjs/common';
import { PariOraiUsdtRepository } from 'src/repositories/postgre';

@Injectable()
export class CrawlRpcService {
  constructor() {}

  public async getOnePair() {
    return PariOraiUsdtRepository.find({
      take: 1 
    });
  }
}
