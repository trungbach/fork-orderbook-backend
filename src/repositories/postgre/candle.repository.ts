import PostgresDB from 'src/config/postgres';
import { Candle } from '../../entities/postgre/candle.entity';

export const CandleRepository = PostgresDB.getRepository(Candle).extend({
  findLastCandleByProductId(productId: number, granularity: number) {
    const lastCandle = this.createQueryBuilder('candle')
      .where('candle.product_id = :product_id', { product_id: productId })
      .andWhere('candle.granularity = :granularity', { granularity })
      .orderBy('time DESC')
      .limit(1)
      .getOne();

    return lastCandle;
  },

  findCandlesbyByProductId(
    productId: number,
    granularity: number,
    startTime: number,
    endTime: number,
  ) {
    const qb = this.createQueryBuilder('candle')
      .where('candle.product_id = :product_id', { product_id: productId })
      .andWhere('candle.granularity = :granularity', { granularity })
      .andWhere('candle.time >= :startTime', { startTime })
      .andWhere('candle.time <= :endTime', { endTime })
      .select([
        'candle.time AS time',
        'candle.open AS open',
        'candle.close AS close',
        'candle.high AS high',
        'candle.low AS low',
        'candle.volume AS volume',
      ]);

    const candles = qb.getRawMany();
    return candles;
  },
});
