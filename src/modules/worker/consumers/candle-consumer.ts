import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { TradeEvent } from '../types';
import { CandleRepository } from 'src/repositories/postgre';
import { roundTime } from 'src/utils/date';
import { Candle } from 'src/entities/postgre';
import { min, max, add } from 'lodash';

@Processor('order-queue')
export class CandleConsumer {
  private GRANULARITY_ARR = [1, 5, 15, 30, 60, 360, 1440];

  constructor() {} // inject logging service

  @Process('candle-job')
  async mainProcessCandle(job: Job<Array<TradeEvent>>): Promise<void> {
    const eventTick = job.data;
    await this.handleCandleEvent(eventTick);
  }

  private async handleCandleEvent(ticks: TradeEvent[]) {
    const candles: { [key: string]: Candle } = {};

    for (const tick of ticks) {
      const { time, price, volume, productId } = tick;
      for (const granularity of this.GRANULARITY_ARR) {
        let candle: Candle;

        const newTime = roundTime(new Date(time), granularity);
        const candle_id = `${productId}-${newTime}-${granularity}`;

        candle = candles[candle_id];
        if (!candle) {
          candle = await CandleRepository.findOne({
            where: {
              productId: +productId,
              granularity,
              time: newTime,
            },
          });
        }

        if (!candle) {
          candle.granularity = granularity;
          candle.productId = +productId;
          candle.time = newTime;
          candle.close = price;
          candle.high = price;
          candle.low = price;
          candle.volume = volume;
          candle.open = price;
        } else {
          candle.close = price;
          candle.high = max([candle.high, price]);
          candle.low = min([candle.low, price]);
          candle.volume = add(candle.volume, volume);
        }

        candles[candle_id] = candle;
      }

      if (Object.keys(candles).length > 0) {
        await this.handleNewCandles(candles);
      }
    }
  }

  private async handleNewCandles(candles: { [key: string]: Candle }) {
    // public event to socket and insert to database
    const newCandles = Object.entries(candles).map(([key, value]) => {
      return value;
    });

    await CandleRepository.save(newCandles);
  }
}
