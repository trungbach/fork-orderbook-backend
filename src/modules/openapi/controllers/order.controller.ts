import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiExtraModels, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApiPagination, Pagination } from '../decorators/pagination.decorator';
import { OrderService } from '../services';
import { IPagination } from '../types/pagnation';
import { QueryOrderDto } from '../models/order.dto';
import { OrderSide, OrderStatus } from 'src/utils/constant';

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
  @Get('/products/:product_id')
  async getOrders(
    @Param('product_id') product_id: number,
    @Pagination() pagination: IPagination,
    @Query() params: QueryOrderDto,
  ) {
    const orders = await this.orderService.getByProduct(
      product_id,
      pagination.limit,
      pagination.offset,
      params.address,
      params?.order_side?.map((side) => Number(OrderSide[side])),
      params?.order_status?.map((status) => Number(OrderStatus[status])),
    );
    return orders;
  } 
}
