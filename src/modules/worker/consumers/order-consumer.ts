import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { OrderEvent, TradeEvent, TradeUserEvent } from '../types';
import { Order } from 'src/entities/postgre';
import { OrdereRepository } from 'src/repositories/postgre';
import * as moment from 'moment';
import {
  TICKER_PRICE,
  OrderAction,
  OrderStatus,
  OrderSide,
} from 'src/utils/constant';
import { logErrorConsole } from 'src/utils/log-provider';
import { Redis } from 'src/utils';

@Processor('order-queue')
export class OrderConsumer {
  constructor(
    @InjectQueue('candle-queue')
    private readonly candleQueue: Queue,

    @InjectQueue('trade-queue')
    private readonly tradeQueue: Queue,
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
      order.ask_amount,
      intTime,
      order.tradeSequence,
      order.side,
      OrderStatus.OPEN,
      order.offer_amount,
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
    const {
      tradeSequence,
      ask_amount,
      userId,
      price,
      side,
      tradeStatus,
      offer_amount,
    } = order;
    const intTime = moment(order.time).unix();

    const rootOrder = await OrdereRepository.findOne({
      where: {
        tradeSequence,
        status: OrderStatus.OPEN,
      },
    });

    if (!rootOrder) {
      return;
    }
    const redisInstance = await Redis.getInstance();
    await redisInstance.set(`${rootOrder.productId}.${TICKER_PRICE}`, price);

    if (tradeStatus === 'Fulfilled') {
      rootOrder.status = OrderStatus.FUL_FILLED;
      await OrdereRepository.save(rootOrder);

      const closeOrder = new Order(
        rootOrder.productId,
        userId,
        price,
        ask_amount,
        intTime,
        tradeSequence,
        side,
        OrderStatus.CLOSE,
        offer_amount,
      );

      await OrdereRepository.save([closeOrder]);
      await this.sendToCandleQueue({
        productId: `${rootOrder.productId}`,
        price: price,
        volume: OrderSide.BUY
          ? order.offer_amount
          : Number(order.offer_amount) * price,
        time: order.time,
      });
      await this.sendToUserTradeQueue({
        productId: `${rootOrder.productId}`,
        userId: rootOrder.userId,
        price: price,
        volume: OrderSide.BUY
          ? order.offer_amount
          : Number(order.offer_amount) * price,
        time: order.time,
      });
      return;
    }

    if (tradeStatus === 'PartialFilled') {
      const totalVolumeFulFilled = await OrdereRepository.sumOfOfferAmountOrder(
        tradeSequence,
        OrderStatus.FUL_FILLED,
      );
      rootOrder.status = OrderStatus.FILLING;
      await OrdereRepository.save(rootOrder);

      const newOfferAmount =
        Number(rootOrder.offerAmount) -
        offer_amount +
        Number(totalVolumeFulFilled);
      const offerAmountFulFilled =
        Number(rootOrder.offerAmount) - newOfferAmount;

      const fulFilledOrder = new Order(
        rootOrder.productId,
        userId,
        price,
        side === OrderSide.BUY
          ? offerAmountFulFilled / price
          : offerAmountFulFilled * price,
        intTime,
        tradeSequence,
        side,
        offerAmountFulFilled > 0 ? OrderStatus.FUL_FILLED : OrderStatus.CLOSE,
        offerAmountFulFilled,
      );
      const newOpenOrder = new Order(
        rootOrder.productId,
        userId,
        price,
        side === OrderSide.BUY
          ? newOfferAmount / price
          : newOfferAmount * price,
        intTime,
        tradeSequence,
        side,
        OrderStatus.OPEN,
        newOfferAmount,
      );
      await OrdereRepository.save([newOpenOrder, fulFilledOrder]);
      await this.sendToCandleQueue({
        productId: `${rootOrder.productId}`,
        price: price,
        volume: OrderSide.BUY
          ? offerAmountFulFilled
          : offerAmountFulFilled * price,
        time: order.time,
      });
      await this.sendToUserTradeQueue({
        productId: `${rootOrder.productId}`,
        userId: rootOrder.userId,
        price: price,
        volume: OrderSide.BUY
          ? offerAmountFulFilled
          : offerAmountFulFilled * price,
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

  private async sendToUserTradeQueue(event: TradeUserEvent | TradeUserEvent[]) {
    if (!Array.isArray(event)) {
      event = [event];
    }

    await this.tradeQueue.add('trade-job', event, {
      removeOnComplete: true,
      removeOnFail: false,
      attempts: 3,
    });
  }
}
