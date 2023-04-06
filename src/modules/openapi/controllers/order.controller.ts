import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiExtraModels, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApiPagination, Pagination } from '../decorators/pagination.decorator';
import { OrderService } from '../services';
import { IPagination } from '../types/pagnation';

@ApiTags('Orders')
@ApiExtraModels(Pagination)
@Controller('v1/orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiPagination({
    defaultLimit: 30,
    maxSize: 50,
    offset: 0,
  })
  @ApiParam({
    name: 'address',
    required: true,
    description: 'history transactions by user Orai address',
    type: Number
  })
  @Get('/users/:address')
  async listOrderByUser(
    @Param('address') address: string,
    @Pagination() pagination: IPagination,
  ) {
    const { limit, offset } = pagination;
    return await this.orderService.getByAddress(address, limit, offset);
  }

  @ApiPagination({
    defaultLimit: 30,
    maxSize: 50,
    offset: 0,
  })
  @ApiParam({
    name: 'product_id',
    required: true,
    description: 'query by product id',
    type: Number
  })
  @ApiQuery({
    name:'status',
    required: false,
    description: 'query by status'
  })
  @ApiQuery({
    name:'address',
    required: false,
    description: 'query by address'
  })
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

  @ApiPagination({
    defaultLimit: 30,
    maxSize: 50,
    offset: 0,
  })
  @ApiParam({
    name: 'product_id',
    required: true,
    description: 'query by product id',
    type: Number
  })
  @Get('/products/:product_id/recent_trade')
  async listOrderRecentTradedByProduct(
    @Param('product_id') product_id: number,
    @Pagination() pagination: IPagination,
  ) {
    return await this.orderService.getRecentTraded(
      product_id,
      pagination.limit,
      pagination.offset,
    );
  }
}
