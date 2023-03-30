import PostgresDB from '../../config/postgres';
import { Order } from '../../entities/postgre';

export const OrdereRepository = PostgresDB.getRepository(Order).extend({
  async findByAddress(address: string, limit: number, offset: number) {
    let qb = this.createQueryBuilder('order'); // qb mean query builder

    qb = qb
      .leftJoin('o_user', 'user', 'user.id = order.user_id')
      .where('user.address = :address', { address });

    const count = await qb.getCount();
    const orders = await qb
      .limit(limit)
      .offset(offset)
      .select()
      .getMany();

    return { count, orders };
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
      .where('p.id = :product_id', { product_id: productId });

    
    if (address) {
      qb = qb.andWhere('u.address = :address', { address });
    }

    if (status) {
      qb = qb.andWhere('order.status = :status', { status });
    }

    const count = await qb.getCount();
    const orders = await qb
      .limit(limit)
      .offset(offset) 
      .select()
      .getMany();
    
    return { count, orders };
  },
});
