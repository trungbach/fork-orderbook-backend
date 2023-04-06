import { Order } from 'src/entities/postgre';

export class OrderDto {
  id: number;
  price: number;
  amount: number;
  side: number;
  status: number;
  trade_sequence: number;
  time: number;

  constructor(order: Order) {
    this.id = order.id;
    this.price = +order.price;
    this.amount = +order.amount;
    this.side = +order.side;
    this.status = +order.status;
    this.time = +order.time;
    this.trade_sequence = +order.tradeSequence;
  }
}
