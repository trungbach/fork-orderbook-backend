import { Candle } from 'src/entities/postgre';

export class CandleDto {
  time: number;
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;

  constructor(candle: Candle) {
    this.time = +candle.time;
    this.open = +candle.open;
    this.close = +candle.close;
    this.high = +candle.high;
    this.low = +candle.low;
    this.volume = +candle.volume;
  }
}
