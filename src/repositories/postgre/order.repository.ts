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
      qb = qb.andWhere('order.status IN (:...status)', {
        status: params.status,
      });
    }

    if (params?.side) {
      qb = qb.andWhere('order.side IN (:...side)', { side: params.side });
    }

    const orders = await qb
      .limit(params.limit)
      .offset(params.offset)
      .select([
        'order.time AS time',
        'order.side AS side',
        'order.status AS status',
        'order.tradeSequence AS trade_sequence',
        'order.offerAmount AS offer_amount',
        'order.askAmount AS ask_amount',
        'order.price AS price',
        'order.id AS id',
      ])
      .getRawMany();
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
      .select('SUM(order.ask_amount)', 'sum');

    const { sum } = await qb.getRawOne();
    return sum;
  },

  async sumOfOfferAmountOrder(tradeSequence: number, status: number) {
    const qb = this.createQueryBuilder('order')
      .where('order.trade_sequence = :tradeSequence', { tradeSequence })
      .andWhere('order.status = :status', { status })
      .select('SUM(order.offer_amount)', 'sum');

    const { sum } = await qb.getRawOne();
    return sum;
  },

  async findOpenOrders(product_id: number, side: number) {
    const qb = this.createQueryBuilder('order')
      .where('order.status = :status', { status: OrderStatus.OPEN })
      .andWhere('order.side = :side', { side })
      .andWhere('order.product_id = :product_id', { product_id })
      .groupBy('order.price')
      .limit(17) // only get 17 records for display
      .orderBy('order.price', 'DESC')
      .select(['order.price', 'SUM(order.offer_amount)']);

    const result = await qb.getRawMany();
    return result;
  },
});
