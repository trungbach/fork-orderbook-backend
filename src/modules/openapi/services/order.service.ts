import { Injectable } from '@nestjs/common';
import { OrdereRepository } from 'src/repositories/postgre';

@Injectable()
export class OrderService {
  constructor() {
    //inject
  }

  async getByProduct(
    productId: number,
    size: number,
    page: number,
    status?: number,
  ) {
    const { count, orders } = await OrdereRepository.findOrderByProduct(
      productId,
      size,
      page,
      status,
    );

    return {
      count,
      orders,
    };
  }

  async getByAddress(address: string, size: number, page: number) {
    const { count, orders } = await OrdereRepository.findByAddress(
      address,
      size,
      page,
    );

    return {
      count,
      orders,
    };
  }
}
