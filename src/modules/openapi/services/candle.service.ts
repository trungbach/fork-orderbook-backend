import { Injectable } from '@nestjs/common';
import { CandleRepository } from 'src/repositories/postgre';
import { CandleDto } from '../models/candle.dto';
import { of, catchError, from, retry } from 'rxjs';

@Injectable()
export class CandleService {
  getCandlesByProduct(
    productId: number,
    granularity: number,
    startTime: number,
    endTime: number,
  ) {
    return from<CandleDto[]>(
      CandleRepository.findCandlesbyByProductId(
        productId,
        granularity,
        startTime,
        endTime,
      ),
    ).pipe(
      catchError((err) =>
        of({
          error: true,
          message: `${this.getCandlesByProduct} - Something wrongs`,
        }),
      ),
      retry({
        count: 2,
        resetOnSuccess: true
      })
    );
  }
}
