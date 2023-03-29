import { Injectable } from '@nestjs/common';
import { OrdereRepository } from 'src/repositories/postgre';

@Injectable()
export class OrderService {
  constructor() {
    //inject
  }

  async getByProduct(
    productId: number,
    status: number,
    size: number,
    page: number,
  ) {
    const { count, orders } = await OrdereRepository.findOrderByProduct(
      productId,
      status,
      size,
      page,
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
