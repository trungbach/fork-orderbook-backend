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

  async findOrderByProduct(
    productId: number,
    limit: number,
    offset: number,
    address?: string,
    status?: number,
  ) {
    let qb = this.createQueryBuilder('order');

    qb = qb
      .leftJoin('o_product', 'p', 'p.id = order.product_id')
      .leftJoin('o_user', 'u', 'u.id = order.user_id')
      .where('p.id = :product_id', { product_id: productId })
      .orderBy('order.time', 'DESC');

    if (address) {
      qb = qb.andWhere('u.address = :address', { address });
    }

    if (status) {
      qb = qb.andWhere('order.status = :status', { status });
    }

    const orders = await qb.limit(limit).offset(offset).select().getMany();
    return orders;
  },

  async findRecentTraded(productId: number, limit: number, offset: number) {
    let qb = this.createQueryBuilder('order');

    qb = qb
      .where('order.product_id = :product_id', { product_id: productId })
      .andWhere('order.status = :status', {
        status: OrderStatus.FULL_FILLED,
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
});
