import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Pagination } from '../decorators/pagination.decorator';
import { OrderService } from '../services';
import { IPagination } from '../types/pagnation';

@ApiTags('Orders')
@Controller('v1/orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('/users/:address')
  async listOrderByUser(
    @Param('address') address: string,
    @Pagination() pagination: IPagination,
  ) {
    const { limit, offset } = pagination;
    return await this.orderService.getByAddress(address, limit, offset);
  }

  @Get('/products/:product_id')
  async listOrderByProduct(
    @Param('product_id') product_id: number,
    @Pagination() pagination: IPagination,
    @Query('status') status?: number,
    @Query('address') address?: string,
  ) {
    return await this.orderService.getByProduct(
      product_id,
      pagination.limit,
      pagination.offset,
      address,
      status,
    );
  }

  @Get('/products/:product_id/recent_trade')
  async listOrderRecentTradedByProduct(
    @Param('product_id') product_id: number,
    @Pagination() pagination: IPagination,
  ) {
    return await this.orderService.getRecentTraded(
        product_id, 
        pagination.limit,
        pagination.offset,
    )
  }
}
