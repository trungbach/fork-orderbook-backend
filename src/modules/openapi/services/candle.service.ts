import { Injectable } from '@nestjs/common';
import { CandleRepository } from 'src/repositories/postgre';

@Injectable()
export class CandleService {
  async getCandlesByProduct(
    productId: number,
    granularity: number,
    startTime: number,
    endTime: number,
  ) {
    return await CandleRepository.findCandlesbyByProductId(
      productId,
      granularity,
      startTime,
      endTime,
    );
  }
}
