import { Candle } from 'src/entities/postgre';
import { CandleRepository } from 'src/repositories/postgre';

const seeds: Candle[] = [
  {
    id: 1,
    productId: 1,
    granularity: 1,
    time: 1680016500,
    open: 1.1,
    close: 1.2,
    high: 1.3,
    low: 1.0,
    volume: 1.0,
  },
  {
    id: 2,
    productId: 1,
    granularity: 1,
    time: 1680015600,
    open: 10,
    close: 12,
    high: 18,
    low: 9,
    volume: 10,
  },
  {
    id: 3,
    productId: 1,
    granularity: 1,
    time: 1680026400,
    open: 1.1,
    close: 1.2,
    high: 1.3,
    low: 1.0,
    volume: 1.0,
  },
];

export class CandleSeed {
  async run() {
    for await (const item of seeds) {
      await this.insertCandle(item);
    }

    console.info('Seed candles success');
  }

  async insertCandle(item: Candle) {
    const itemDb = await CandleRepository.findOne({
      where: {
        id: item.id,
      },
    });

    if (!itemDb) {
      const newItem = CandleRepository.create(item);
      await CandleRepository.save(newItem);
    }
  }
}
