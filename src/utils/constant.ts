export enum OrderStatus {
  OPEN = 1,
  FUL_FILLED = 2,
  FILLING = 3,
  CANCELED = 10,
  CLOSE = 4,
}

export enum OrderSide {
  SELL = 1,
  BUY = 2,
}

/**
 * direction key = direction of contract response
 */
export const OrderDirection = {
  Buy: OrderSide.BUY,
  Sell: OrderSide.SELL,
};

export enum OrderAction {
  SUBMIT_ORDER = 'SUBMIT_ORDER',
  EXECUTE_ORDER = 'EXECUTE_ORDER',
  CANCELLED = 'CANCEL_ORDER',
}

export const OrderStatusParams = {
  OPEN: 1,
  FILLED: 2,
  ALL: 5,
  CANCEL: 10,
};

export const TICKER_PRICE = 'ticker';
export const BOT_ADDRESSES = [
  'orai1tjnzc2ynnwzqrdsk4uwpqlta36xjcntcnzeyy0',
  'orai1vsv3dudchgg65wlkv6uz35qexaypg03mqwwmt2',
];
