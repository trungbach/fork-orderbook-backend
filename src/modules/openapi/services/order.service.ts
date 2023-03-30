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
    size: number,
    page: number,
    address?: string,
    status?: number,
  ): Promise<PageList<OrderDto[]>> {
    const { count, orders } = await OrdereRepository.findOrderByProduct(
      productId,
      size,
      page,
      address,
      status,
    );

    const items: OrderDto[] = orders.map((order: Order) => new OrderDto(order));
    return new PageList<OrderDto[]>(count, items);
  }

  async getByAddress(
    address: string,
    size: number,
    page: number,
  ): Promise<PageList<OrderDto[]>> {
    const { count, orders } = await OrdereRepository.findByAddress(
      address,
      size,
      page,
    );

    const items: OrderDto[] = orders.map((order: Order) => new OrderDto(order));
    return new PageList<OrderDto[]>(count, items);
  }
}
