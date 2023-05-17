import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/postgre';
import {
  OrdereRepository,
  ProductRepository,
  UserRepository,
} from 'src/repositories/postgre';
import { OrderDto, OrdersDto } from '../models/order.dto';
import { PageList } from '../models/page-list.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class OrderService {
  constructor() {
    //inject
  }

  async getByProduct(
    productId: number,
    limit: number,
    offset: number,
    address?: string,
    status?: string[],
    side?: string[],
  ): Promise<PageList<OrderDto[]>> {
    const product = await ProductRepository.findOne({
      where: { id: productId },
    });
    let user: User = null;

    if (address) {
      user = await UserRepository.findOne({ where: { address } });
    }

    if (!product) {
      return new PageList<OrderDto[]>([]);
    }

    if (address && !user) {
      return new PageList<OrderDto[]>([]);
    }

    const params = {
      productId,
      limit,
      offset,
      ...(address ? { userId: user.id } : {}),
      ...(status?.length ? { status } : {}),
      ...(side?.length ? { side } : {}),
    };

    const orders = await OrdereRepository.findOrderByProduct(params);
    const data = plainToInstance(
      OrdersDto,
      { orders },
      { excludeExtraneousValues: true },
    );

    return new PageList<OrderDto[]>(data.orders);
  }

  async getByAddress(
    address: string,
    limit: number,
    offset: number,
  ): Promise<PageList<OrderDto[]>> {
    const orders = await OrdereRepository.findByAddress(address, limit, offset);
    return new PageList<OrderDto[]>(
      plainToInstance(
        OrdersDto,
        { orders },
        { excludeExtraneousValues: true },
      ).orders,
    );
  }

  async getRecentTraded(
    product_id: number,
    limit: number,
    offset: number,
  ): Promise<PageList<OrderDto[]>> {
    const orders = await OrdereRepository.findRecentTraded(
      product_id,
      limit,
      offset,
    );

    // const items: OrderDto[] = orders.map((order: Order) => new OrderDto(order));
    return new PageList<OrderDto[]>(
      plainToInstance(
        OrdersDto,
        { orders },
        { excludeExtraneousValues: true },
      ).orders,
    );
  }

  async getOpen(product_id: number, side: number) {
    const orders = await OrdereRepository.findOpenOrders(product_id, side);
    return orders;
  }
}
