import PostgresDB from 'src/config/postgres';
import { Candle } from '../../entities/postgre/candle.entity';

export const CandleRepository = PostgresDB.getRepository(Candle).extend({
  getLastCandleByProductId(productId: number, granularity: number) {
    const lastCandle = this.createQueryBuilder('candle')
      .where('candle.product_id = :product_id', { product_id: productId })
      .andWhere('candle.granularity = :granularity', { granularity })
      .orderBy('time DESC')
      .limit(1)
      .getOne();

    return lastCandle;
  },

  getCandlesbyByProductId(
    productId: number,
    granularity: number,
    limit?: number,
    offset?: number,
  ) {
    let qb = this.createQueryBuilder('candle')
      .where('candle.product_id = :product_id', { product_id: productId })
      .andWhere('candle.granularity = :granularity', { granularity });

    const count = qb.count();

    if (limit) qb = qb.limit(limit);

    if (offset) qb = qb.offset(offset);

    const candles = qb.getMany();
    return {
      count,
      candles,
    };
  },
});
