import { Order } from "src/entities/postgre";

export class OrderDto {
  price: number;
  amount: number;
  side: number;
  status: number;
  time: number;

  constructor(order: Order) {
    this.price = +order.price;
    this.amount = +order.amount;
    this.side = +order.side;
    this.status = +order.status;
    this.time = +order.time;
  }
}
