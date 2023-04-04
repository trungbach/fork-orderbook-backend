import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { OrderEvent, TradeEvent } from '../types';
import { Order } from 'src/entities/postgre';
import { OrdereRepository } from 'src/repositories/postgre';
import * as moment from 'moment';
import { OrderAction, OrderStatus } from 'src/utils/constant';
import { logErrorConsole } from 'src/utils/log-provider';

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

  private async handleOrderEvents(orders: OrderEvent[]) {
    for (const order of orders) {
      try {
        switch (order.action) {
          case OrderAction.SUBMIT_ORDER:
            await this.handleSubmitOrder(order);
            break;
          case OrderAction.EXECUTE_ORDER:
            await this.handleExecuteOrder(order);
            break;
          case OrderAction.CANCELLED:
            await this.handleCancelOrder(order);
            break;
        }
      } catch (err) {
        logErrorConsole(OrderConsumer.name, this.handleOrderEvents.name, err);
        return null;
      }
    }
  }

  private async handleSubmitOrder(order: OrderEvent): Promise<void> {
    const intTime = moment(order.time).unix();
    let _order = await OrdereRepository.findOne({
      where: {
        tradeSequence: order.tradeSequence,
        status: OrderStatus.OPEN,
      },
    });
    if (_order) {
      return;
    }

    _order = new Order(
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
    const { tradeSequence, amount, userId, price, side } = order;
    const intTime = moment(order.time).unix();

    const _order = await OrdereRepository.findOne({
      where: {
        tradeSequence,
        status: OrderStatus.OPEN,
      },
    });

    if (!_order) {
      return;
    }

    if (amount < _order.amount) {
      // change status of order to filling
      _order.status = OrderStatus.FILLING;
      await OrdereRepository.save(_order);

      // create new two orders, order_1 for full filled
      const _order_1 = new Order(
        _order.productId,
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
        _order.productId,
        userId,
        price,
        _order.amount - amount,
        intTime,
        tradeSequence,
        side,
        OrderStatus.OPEN,
      );

      await OrdereRepository.save([_order_1, _order_2]);
      await this.sendToCandleQueue({
        productId: `${_order_1.productId}`,
        price: _order_1.price,
        volume: _order_1.price * _order_1.amount,
        time: order.time,
      });

      return;
    }

    if (amount === _order.amount) {
      _order.status = OrderStatus.FULL_FILLED;

      await OrdereRepository.save(_order);
      await this.sendToCandleQueue({
        productId: `${_order.productId}`,
        price: _order.price,
        volume: _order.price * _order.amount,
        time: order.time,
      });

      return;
    }
  }

  private async sendToCandleQueue(event: TradeEvent | TradeEvent[]) {
    if (!Array.isArray(event)) {
      event = [event];
    }
    await this.candleQueue.add('candle-job', event, {
      removeOnComplete: true,
      removeOnFail: false,
      attempts: 3,
    });
  }
}
