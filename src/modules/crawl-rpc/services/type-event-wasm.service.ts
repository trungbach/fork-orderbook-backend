import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { logErrorConsole } from 'src/utils/log-provider';
import { TxsBasic, AttributeEvent } from '../dtos';
import { OrderEvent } from 'src/modules/worker/types';
import {
  ProductRepository,
  UserRepository,
  TxsRepository,
} from 'src/repositories/postgre';
import { OrderAction, OrderDirection } from 'src/utils/constant';
import { ILike } from 'typeorm';

const ActionEnable = {
  submit: 'submit_order',
  cancel: 'cancel_order',
  match: 'execute_orderbook_pair',
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
          let orderEvent: OrderEvent | OrderEvent[];
          switch (attributes.value) {
            case ActionEnable.submit:
              orderEvent = await this.orderSubmit(
                eventType.attributes,
                txsData,
              );
              break;
            case ActionEnable.cancel:
              orderEvent = await this.orderCancel(
                eventType.attributes,
                txsData,
              );
              break;
            case ActionEnable.match:
              orderEvent = await this.orderMatch(eventType.attributes, txsData);
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
  private async orderSubmit(
    eventAttrs: AttributeEvent[],
    txsData: TxsBasic,
  ): Promise<OrderEvent> {
    const orderEvent = new OrderEvent();
    let tokenFrom: string;
    let tokenTo: string;
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
          orderEvent.offer_amount = Number(assetTo[0]);
          tokenTo = assetTo[1].toLowerCase();
          break;
        case 'ask_asset':
          const assetFrom = val.split(' ');
          if (assetFrom.length !== 2) {
            break;
          }
          orderEvent.ask_amount = Number(assetFrom[0]);
          tokenFrom = assetFrom[1].toLowerCase();
          break;
        default:
          // nothing
          break;
      }
    }
    if (orderEvent.ask_amount) {
      orderEvent.price = orderEvent.offer_amount / orderEvent.ask_amount;
      if (orderEvent.side === OrderDirection.Sell) {
        orderEvent.price = 1 / orderEvent.price;
      }
    }
    orderEvent.productId = await this.findProductId(tokenFrom, tokenTo);
    if (!orderEvent.productId) {
      throw new Error(`Not found pair product ${tokenFrom} / ${tokenTo}`);
    }
    orderEvent.action = OrderAction.SUBMIT_ORDER;
    orderEvent.time = txsData.time;
    return orderEvent;
  }

  /**
   * event main: cancel
   *
   * @param eventAttrs
   * @returns
   */
  private async orderCancel(
    eventAttrs: AttributeEvent[],
    txsData: TxsBasic,
  ): Promise<OrderEvent> {
    const orderEvent = new OrderEvent();
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
          orderEvent.ask_amount = Number(assetFrom[0]);
          break;
        default:
          // nothing
          break;
      }
    }
    orderEvent.action = OrderAction.CANCELLED;
    orderEvent.time = txsData.time;
    return orderEvent;
  }

  /**
   * event main: match
   *
   * @param eventAttrs
   * @returns
   */
  private async orderMatch(eventAttrs: AttributeEvent[], txsData: TxsBasic) {
    let valMathedLists: string;
    for (const attr of eventAttrs) {
      const val = attr.value.trim();
      if (attr.key === 'list_order_matched') {
        valMathedLists = val;
        break;
      }
    }
    if (!valMathedLists) {
      return [];
    }
    valMathedLists = valMathedLists
      .replace(/Attribute\s/g, '')
      .replace(/key(\s)*\:/g, '"key":')
      .replace(/value(\s)*\:/g, '"value":');
    let attrsEvents: AttributeEvent[][];
    try {
      attrsEvents = JSON.parse(valMathedLists);
    } catch (err) {
      logErrorConsole(
        'ERROR parse json execute_orderbook_pair',
        err,
        valMathedLists,
      );
      return [];
    }
    const orderEvents: OrderEvent[] = [];
    for (const item of attrsEvents) {
      const orderEvent = await this.orderItemMatched(item);
      orderEvent.time = txsData.time;
      orderEvents.push(orderEvent);
    }
    return orderEvents;
  }

  /**
   * event main: cancel
   *
   * @param eventAttrs
   * @returns
   */
  private async orderItemMatched(eventAttrs: AttributeEvent[]) {
    const orderEvent = new OrderEvent();
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
        case 'status':
          orderEvent.tradeStatus = val;
          break;
        case 'filled_offer_amount':
          orderEvent.offer_amount = Number(val);
          break;
        case 'filled_ask_amount':
          orderEvent.ask_amount = Number(val);
          break;
        default:
          // nothing
          break;
      }
    }
    if (orderEvent.ask_amount) {
      orderEvent.price = orderEvent.offer_amount / orderEvent.ask_amount;
      if (orderEvent.side === OrderDirection.Sell) {
        orderEvent.price = 1 / orderEvent.price;
      }
    }
    orderEvent.action = OrderAction.EXECUTE_ORDER;
    return orderEvent;
  }

  private async orderEventSendToQueue(
    orderEvent: OrderEvent | OrderEvent[],
    txsData: TxsBasic,
  ) {
    if (Array.isArray(orderEvent)) {
      if (orderEvent.length === 0) {
        return;
      }
    } else {
      if (!orderEvent) {
        return;
      }
      orderEvent = [orderEvent];
    }

    try {
      const tx = await this.storeTransaction(orderEvent, txsData);
      if (!tx) {
        console.info('TXS job', orderEvent, txsData);
        await this.queueServ.add('order-job', orderEvent, {
          removeOnComplete: true,
          attempts: 3,
        });
      }
    } catch (err) {
      logErrorConsole('Error store txs', err);
    }
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
    const strPair = `${from} - ${to}`;
    if (this.productPair[strPair]) {
      return this.productPair[strPair];
    }
    const productItem = await ProductRepository.findOne({
      select: ['id'],
      where: [
        {
          from: ILike(from),
          to: ILike(to),
        },
        {
          from: ILike(to),
          to: ILike(from),
        },
      ],
    });
    if (!productItem) {
      return null;
    }
    this.productPair[strPair] = productItem.id;
    return productItem.id;
  }

  private async storeTransaction(
    orderEvent: OrderEvent | OrderEvent[],
    txsData: TxsBasic,
  ) {
    const item = await TxsRepository.findOne({
      select: ['hash'],
      where: {
        hash: txsData.hash,
      },
    });
    if (item) {
      return true;
    }
    await TxsRepository.save(
      TxsRepository.create({
        hash: txsData.hash,
        height: txsData.height,
        time: txsData.time,
        data: JSON.stringify(orderEvent),
      }),
    );

    return false;
  }
}
