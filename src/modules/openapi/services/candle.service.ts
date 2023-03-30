import { Injectable } from '@nestjs/common';
import { Candle } from 'src/entities/postgre';
import { CandleRepository } from 'src/repositories/postgre';
import { CandleDto } from '../models/candle.dto';

@Injectable()
export class CandleService {
  async getCandlesByProduct(
    productId: number,
    granularity: number,
    startTime: number,
    endTime: number,
  ): Promise<CandleDto[]> {
    const candles = await CandleRepository.findCandlesbyByProductId(
      productId,
      granularity,
      startTime,
      endTime,
    );
    return candles.map((candle: Candle) => new CandleDto(candle))
  }
}
