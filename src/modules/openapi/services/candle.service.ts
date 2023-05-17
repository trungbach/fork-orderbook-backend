import { Injectable } from '@nestjs/common';
import { CandleRepository } from 'src/repositories/postgre';
import { CandleDto, CandlesDto } from '../models/candle.dto';
import { map, of, catchError, from, retry } from 'rxjs';
import { plainToClass } from 'class-transformer';

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
      map((candles) => {
        return plainToClass(
          CandlesDto,
          { candles },
          { excludeExtraneousValues: true },
        ).candles;
      }),
      catchError((err) =>
        of({
          error: true,
          message: `${this.getCandlesByProduct} - Something wrongs`,
        }),
      ),
      retry({
        count: 2,
        resetOnSuccess: true,
      }),
    );
  }
}
