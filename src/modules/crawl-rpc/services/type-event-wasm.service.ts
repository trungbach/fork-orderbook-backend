import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { logErrorConsole } from 'src/utils/log-provider';
import { TxsBasic, AttributeEvent } from '../dtos';
import { OrderEvent } from 'src/modules/worker/types';
import { ProductRepository, UserRepository } from 'src/repositories/postgre';
import { OrderAction, OrderDirection } from 'src/utils/constant';

const ActionEnable = {
  submit: 'submit_order',
  cancel: 'cancel_order',
  match: 'match_order',
};

@Injectable()
export class TypeEventWasm {
  /**
   * store product pair find in db -> save cache
   */
  private productPair: any;

  constructor(@InjectQueue('order-queue') private queueServ: Queue) {
    this.productPair = {};
  }

  public async execEventOrderFromLog(log: string, txsData: TxsBasic) {
    let logsObj: any[];
    try {
      logsObj = JSON.parse(log);
    } catch (err) {
      logErrorConsole('error parse json log tx', err);
      return false;
    }
    for (const itemLog of logsObj) {
      if (!itemLog.events || itemLog.events.length === 0) {
        continue;
      }
      for (const eventType of itemLog.events) {
        if (eventType.type !== 'wasm' || eventType.attributes?.length === 0) {
          continue;
        }
        for (const attributes of eventType.attributes) {
          if (attributes.key !== 'action') {
            continue;
          }
          let orderEvent: OrderEvent;
          switch (attributes.value) {
            case ActionEnable.submit:
              orderEvent = await this.orderSubmit(eventType.attributes);
              break;
            case ActionEnable.cancel:
              orderEvent = await this.orderCancel(eventType.attributes);
              break;
            case ActionEnable.match:
              orderEvent = await this.orderMatch(eventType.attributes);
              break;
            default:
              break;
          }
          if (orderEvent) {
            await this.orderEventSendToQueue(orderEvent, txsData);
          }
        }
      }
    }
  }

  /**
   * event main: submit
   *
   * @param eventAttrs
   * @returns
   */
  private async orderSubmit(eventAttrs: AttributeEvent[]): Promise<OrderEvent> {
    const orderEvent = new OrderEvent();
    let tokenFrom: string;
    let tokenTo: string;
    let volume = 0;
    for (const attr of eventAttrs) {
      const val = attr.value.trim();
      switch (attr.key) {
        case 'bidder_addr':
          orderEvent.userId = await UserRepository.findOrCreate(val);
          break;
        case 'order_id':
          orderEvent.tradeSequence = Number(val);
          break;
        case 'direction':
          orderEvent.side = OrderDirection[val];
          break;
        case 'offer_asset':
          const assetTo = val.split(' ');
          if (assetTo.length !== 2) {
            break;
          }
          volume = Number(assetTo[0]);
          tokenTo = assetTo[1].toLowerCase();
          break;
        case 'ask_asset':
          const assetFrom = val.split(' ');
          if (assetFrom.length !== 2) {
            break;
          }
          orderEvent.amount = Number(assetFrom[0]);
          tokenFrom = assetFrom[1].toLowerCase();
          break;
        default:
          // nothing
          break;
      }
    }
    /**
     * buy token -> keep value
     * sell token -> reverse amount, price, token from, to
     */
    if (orderEvent.side === OrderDirection.Sell) {
      const volumAmount = orderEvent.amount;
      orderEvent.amount = volume;
      volume = volumAmount;
    }
    if (orderEvent.amount) {
      orderEvent.price = volume / orderEvent.amount;
    }
    orderEvent.productId = await this.findProductId(tokenFrom, tokenTo);
    if (!orderEvent.productId) {
      throw new Error(`Not found pair product ${tokenFrom} / ${tokenTo}`);
    }
    orderEvent.action = OrderAction.SUBMIT_ORDER;
    return orderEvent;
  }

  /**
   * event main: cancel
   *
   * @param eventAttrs
   * @returns
   */
  private async orderCancel(eventAttrs: AttributeEvent[]) {
    const orderEvent = new OrderEvent();
    // let tokenRefund: string;
    for (const attr of eventAttrs) {
      const val = attr.value.trim();
      switch (attr.key) {
        case 'order_id':
          orderEvent.tradeSequence = Number(val);
          break;
        case 'bidder_refund':
          const assetFrom = val.match(/^\d*/i);
          if (assetFrom.length === 0) {
            break;
          }
          orderEvent.amount = Number(assetFrom[0]);
          // tokenRefund = val.split(/^\d*/i)[1];
          break;
        default:
          // nothing
          break;
      }
    }
    orderEvent.action = OrderAction.CANCELLED;
    return orderEvent;
  }

  /**
   * event main: match
   *
   * @param eventAttrs
   * @returns
   */
  private async orderMatch(eventAttrs: AttributeEvent[]) {
    const orderEvent = new OrderEvent();
    console.log('3333 order match', eventAttrs);
    return orderEvent;
  }

  private async orderEventSendToQueue(
    orderEvent: OrderEvent,
    txsData: TxsBasic,
  ) {
    orderEvent.time = txsData.time;
    console.info('TXS job', orderEvent, txsData);
    await this.queueServ.add('order-job', [orderEvent], {
      removeOnComplete: true,
      attempts: 3,
    });
  }

  /**
   * find token pair in cache (var this.productPair)
   *   exists -> get, not -> find db -> assign into cache
   *
   * @param from
   * @param to
   * @returns
   */
  private async findProductId(from: string, to: string) {
    const strPair = `${from}-${to}`;
    if (this.productPair[strPair]) {
      return this.productPair[strPair];
    }
    const productItem = await ProductRepository.findOne({
      select: ['id'],
      where: [
        {
          from: from,
          to: to,
        },
        {
          from: to,
          to: from,
        },
      ],
    });
    if (!productItem) {
      return null;
    }
    this.productPair[strPair] = productItem.id;
    return productItem.id;
  }
}
