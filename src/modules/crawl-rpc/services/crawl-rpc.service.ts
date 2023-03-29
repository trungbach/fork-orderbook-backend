import {
  Injectable
} from '@nestjs/common';
import { ProductRepository } from 'src/repositories/postgre';

@Injectable()
export class CrawlRpcService {
  public async getOnePair() {
    return ProductRepository.find({
      take: 1 
    });
  }
}
