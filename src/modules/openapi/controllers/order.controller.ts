import { Controller, Get, Param, Query } from '@nestjs/common';
import { OrderService } from '../services';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('users/:address')
  async listOrderByUser(
    @Param('address') address: string,
    @Query('page') page: number,
    @Query('size') size: number,
  ) {
    return await this.orderService.getByAddress(address, size, page);
  }

  @Get('/products/:product')
  async listOrderByProduct(
    @Param('product_id') product_id: number,
    @Query('status') product_status: number,
    @Query('page') page: number,
    @Query('size') size: number,
  ) {
    return await this.orderService.getByProduct(
      product_id,
      product_status,
      page,
      size,
    );
  }
}
