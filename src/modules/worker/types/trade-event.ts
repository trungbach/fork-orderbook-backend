type TradeEvent = {
  productId: string;
  price: number;
  volume: number;
  time: string;
}

type TradeUserEvent = TradeEvent & {
    userId: number;
}

export { TradeEvent, TradeUserEvent };
