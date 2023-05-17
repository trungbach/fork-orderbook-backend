import { Expose, Type } from 'class-transformer';

export class CandlesDto {
  @Expose()
  @Type(() => CandleDto)
  candles: CandleDto[];
}
export class CandleDto {
  @Expose({ name: 'time' })
  time: number;

  @Expose({ name: 'open' })
  open: string;

  @Expose({ name: 'close' })
  close: string;

  @Expose({ name: 'high' })
  high: string;

  @Expose({ name: 'low' })
  low: string;

  @Expose({ name: 'volume' })
  volume: string;
}
