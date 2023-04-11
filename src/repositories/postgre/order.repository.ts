import { OrderStatus } from 'src/utils/constant';
import PostgresDB from '../../config/postgres';
import { Order } from '../../entities/postgre';

export const OrdereRepository = PostgresDB.getRepository(Order).extend({
  async findByAddress(address: string, limit: number, offset: number) {
    let qb = this.createQueryBuilder('order'); // qb mean query builder

    qb = qb
      .leftJoin('o_user', 'user', 'user.id = order.user_id')
      .where('user.address = :address', { address })
      .orderBy('order.time', 'DESC');

    const orders = await qb.limit(limit).offset(offset).select().getMany();

    return orders;
  },

  async findOrderByProduct(params: any) {
    let qb = this.createQueryBuilder('order');

    qb = qb
      .where('order.product_id = :product_id', { product_id: params.productId })
      .orderBy('order.id', 'DESC');

    if (params?.userId) {
      qb = qb.andWhere('order.user_id = :user_id', { user_id: params.userId });
    }

    if (params?.status) {
      qb = qb.andWhere('order.status IN (:status)', { status: params.status });
    }

    if (params?.side) {
      qb = qb.andWhere('order.side IN (:side)', { side: params.side });
    }

    const orders = await qb
      .limit(params.limit)
      .offset(params.offset)
      .select()
      .getMany();
    return orders;
  },

  async findRecentTraded(productId: number, limit: number, offset: number) {
    let qb = this.createQueryBuilder('order');

    qb = qb
      .where('order.product_id = :product_id', { product_id: productId })
      .andWhere('order.status = :status', {
        status: OrderStatus.FUL_FILLED,
      })
      .orderBy('order.time', 'DESC');

    const orders = await qb.limit(limit).offset(offset).select().getMany();
    return orders;
  },

  async sumOfAmountOrder(tradeSequence: number, status: number) {
    const qb = this.createQueryBuilder('order')
      .where('order.trade_sequence = :tradeSequence', { tradeSequence })
      .andWhere('order.status = :status', { status })
      .select('SUM(order.amount)', 'sum');

    const { sum } = await qb.getRawOne();
    return sum;
  },

  async sumOfVolumeOrder(tradeSequence: number, status: number) {
    const qb = this.createQueryBuilder('order')
      .where('order.trade_sequence = :tradeSequence', { tradeSequence })
      .andWhere('order.status = :status', { status })
      .select('SUM(order.volume)', 'sum');

    const { sum } = await qb.getRawOne();
    return sum;
  },
});
