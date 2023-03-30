import { Injectable } from '@nestjs/common';
import { Order } from 'src/entities/postgre';
import { OrdereRepository } from 'src/repositories/postgre';
import { OrderDto } from '../models/order.dto';
import { PageList } from '../models/page-list.dto';

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
    status?: number,
  ): Promise<PageList<OrderDto[]>> {
    const { count, orders } = await OrdereRepository.findOrderByProduct(
      productId,
      limit,
      offset,
      address,
      status,
    );

    const items: OrderDto[] = orders.map((order: Order) => new OrderDto(order));
    return new PageList<OrderDto[]>(count, items);
  }

  async getByAddress(
    address: string,
    limit: number,
    offset: number,
  ): Promise<PageList<OrderDto[]>> {
    const { count, orders } = await OrdereRepository.findByAddress(
      address,
      limit,
      offset,
    );
    const items: OrderDto[] = orders.map((order: Order) => new OrderDto(order));
    return new PageList<OrderDto[]>(count, items);
  }
}
