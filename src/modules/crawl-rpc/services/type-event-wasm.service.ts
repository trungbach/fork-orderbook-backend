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
  constructor(@InjectQueue('order-queue') private queueServ: Queue) {}

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
          switch (attributes.value) {
            case ActionEnable.submit:
              const orderEvent = await this.orderSubmit(eventType.attributes);
              await this.orderEventSendToQueue(orderEvent, txsData);
              break;
            case ActionEnable.cancel:
              await this.cancelSubmit(eventType.attributes);
              break;
            default:
              break;
          }
        }
      }
    }
  }

  private async orderSubmit(eventAttrs: AttributeEvent[]): Promise<OrderEvent> {
    const orderEvent = new OrderEvent();
    let tokenFrom: string;
    let tokenTo: string;
    let volume = 0;
    for (const attr of eventAttrs) {
      const val = attr.value.trim();
      switch (attr.key) {
        case 'ask_asset':
          const assetFrom = val.split(' ');
          if (assetFrom.length !== 2) {
            break;
          }
          orderEvent.amount = Number(assetFrom[0]);
          tokenFrom = assetFrom[1];
          break;
        case 'bidder_addr':
          orderEvent.userId = await UserRepository.findOrCreate(val);
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
          tokenTo = assetTo[1];
          break;
        case 'order_id':
          orderEvent.tradeSequence = Number(val);
          break;
        default:
          break;
      }
    }
    if (orderEvent.amount) {
      orderEvent.price = volume / orderEvent.amount;
    }
    const productItem = await ProductRepository.findOne({
      select: ['id'],
      where: {
        from: tokenFrom.toLowerCase(),
        to: tokenTo.toLowerCase(),
      },
    });
    if (!productItem) {
      throw new Error(`Not found pair product ${tokenFrom} / ${tokenTo}`);
    }
    orderEvent.productId = productItem.id;
    orderEvent.action = OrderAction.SUBMIT_ORDER;
    return orderEvent;
  }

  private cancelSubmit(eventAttr: AttributeEvent[]) {
    // console.log(2222222222222, eventAttr);
  }

  private async orderEventSendToQueue(
    orderEvent: OrderEvent,
    txsData: TxsBasic,
  ) {
    orderEvent.time = txsData.time;
    await this.queueServ.add('order-job', [orderEvent], {
      removeOnComplete: true,
      attempts: 3,
    });
  }
}
