import PostgresDB from '../../config/postgres';
import { Order } from '../../entities/postgre';

export const OrdereRepository = PostgresDB.getRepository(Order).extend({
  async findByAddress(address: string, size: number, page: number) {
    let qb = this.createQueryBuilder('order'); // qb mean query builder

    qb = qb
      .leftJoin('o_user', 'user', 'user.id = order.user_id')
      .where('user.address = :address', { address });

    const count = await qb.count();
    const orders = await qb
      .take(size)
      .skip(size * page)
      .select(['order.*'])
      .getMany();

    return { count, orders };
  },

  async findOrderByProduct(
    productId: number,
    size: number,
    page: number,
    status?: number,
  ) {
    let qb = this.createQueryBuilder('order');

    qb = qb
      .leftJoin('o_product', 'p', 'p.id = order.product_id')
      .where('p.id = product_id', { product_id: productId });

    if (status) {
      qb = qb.andWhere('order.status = :status', { status });
    }

    const count = await qb.count();
    const orders = await qb
      .take(size)
      .skip(size * page)
      .select(['order.*'])
      .getMany();

    return { count, orders };
  },
});
