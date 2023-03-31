export enum OrderStatus {
  OPEN = 1,
  FILLED = 2,
  CANCELED = 10,
}

export enum OrderSide {
  SELL = 1,
  BUY = 2,
}

export const OrderAction = {
  SUBMIT_ORDER: OrderStatus.OPEN,
  CANCEL_ORDER: OrderStatus.CANCELED,
};
