import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { OrderEvent } from '../types';
import { Order } from 'src/entities/postgre';
import { OrdereRepository } from 'src/repositories/postgre';
import * as moment from 'moment';
import { OrderAction, OrderStatus } from 'src/utils/constant';

@Processor('order-queue')
export class OrderConsumer {
  constructor(
    @InjectQueue('order-queue')
    private readonly candleQueue: Queue,
  ) {}

  @Process('order-job')
  async mainProcessOrder(job: Job<OrderEvent[]>): Promise<void> {
    const orderEvents = job.data;
    await this.handleOrderEvents(orderEvents);
  }

  private async handleSubmitOrder(order: OrderEvent): Promise<void> {
    const intTime = moment(order.time).unix();
    const _order = new Order(
      order.productId,
      order.userId,
      order.price,
      order.amount,
      intTime,
      order.tradeSequence,
      order.side,
      OrderStatus.OPEN,
    );

    await OrdereRepository.save(_order);
  }

  private async handleCancelOrder(order: OrderEvent): Promise<void> {
    const _order = await OrdereRepository.findOne({
      where: {
        productId: order.productId,
        tradeSequence: order.tradeSequence,
        status: OrderStatus.OPEN,
      },
    });

    if (!_order) {
      return;
    }

    _order.status = OrderStatus.CANCELED;

    await OrdereRepository.save(_order);
  }

  private async handleExecuteOrder(order: OrderEvent) {
    const { productId, tradeSequence, amount, userId, price, side } = order;
    const intTime = moment(order.time).unix();

    const _order = await OrdereRepository.findOne({
      where: {
        productId,
        tradeSequence,
        status: OrderStatus.OPEN,
      },
    });

    if (amount < _order.amount) {
      // change status of order to filling
      _order.status = OrderStatus.FILLING;

      // create new two orders, order_1 for full filled
      const _order_1 = new Order(
        productId,
        userId,
        price,
        amount,
        intTime,
        tradeSequence,
        side,
        OrderStatus.FULL_FILLED,
      );

      // order_2 for open
      const _order_2 = new Order(
        productId,
        userId,
        price,
        _order.amount - amount,
        intTime,
        tradeSequence,
        side,
        OrderStatus.OPEN,
      );

      await OrdereRepository.save([_order, _order_1, _order_2]);
      await this.candleQueue.add('candle-job', {
        productId: _order_1.productId,
        price: _order_1.price,
        volume: _order_1.price * _order_1.amount,
        time: _order_1.time,
      });

      return;
    }

    if (amount === _order.amount) {
      _order.status = OrderStatus.FULL_FILLED;

      await OrdereRepository.save(_order);
      await this.candleQueue.add('candle-job', {
        productId: _order.productId,
        price: _order.price,
        volume: _order.price * _order.amount,
        time: _order.time,
      });

      return;
    }
  }

  private async handleOrderEvents(orders: OrderEvent[]) {
    for (const order of orders) {
        switch (order.action) {
            case OrderAction.SUBMIT_ORDER:
                await this.handleSubmitOrder(order);
                break;
            case OrderAction.EXECUTE_ORDER:
                await this.handleExecuteOrder(order);
                break;
            case OrderAction.CANCELLED:
                await this.handleCancelOrder(order);
                break
        }
    }
  }
}
