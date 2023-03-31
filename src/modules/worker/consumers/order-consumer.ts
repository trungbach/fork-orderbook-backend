import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { OrderEvent } from '../types';
import { Order } from 'src/entities/postgre';
import { OrdereRepository } from 'src/repositories/postgre';
import * as moment from 'moment';
import { OrderAction } from 'src/utils/constant';

@Processor('order-queue')
export class OrderConsumer {
  constructor() {}

  @Process('order-job')
  async mainProcessOrder(job: Job<OrderEvent[]>): Promise<void> {
    const orderEvents = job.data;
    await this.handleOrderEvents(orderEvents);
  }

  private async handleOrderEvents(orders: OrderEvent[]) {
    for (const order of orders) {
      const {
        productId,
        userId,
        price,
        amount,
        time,
        tradeSequence,
        side,
        action,
      } = order;

      const status = OrderAction[action];
      const intTime = moment(time).unix();

      let _order = await OrdereRepository.findOne({
        where: {
          productId,
          tradeSequence,
        },
      });

      if (_order) {
        _order.status = status;
        _order.side = side;
        _order.time = intTime;
      } else {
        _order = new Order(
          productId,
          userId,
          price,
          amount,
          intTime,
          tradeSequence,
          side,
          status,
        );
      }

      await OrdereRepository.save(_order);
    }
  }
}
