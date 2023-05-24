import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrderService } from '../services';

@ApiTags('Orderbook')
@Controller('/orderbook')
export class OrderbookController {
  constructor(private readonly orderService: OrderService) {}

  // @ApiPagination({
  //   defaultLimit: 30,
  //   maxSize: 50,
  //   offset: 0,
  // })
  @Get('/')
  async getOrders(@Query('ticket_id') ticket_id: string) {
    const orders = await this.orderService.getOrderFromContract(ticket_id);
    return orders;
  }
}
