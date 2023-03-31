export enum OrderStatus {
  OPEN = 1,
  FULL_FILLED = 2,
  FILLING = 3,
  CANCELED = 10,
}

export enum OrderSide {
  SELL = 1,
  BUY = 2,
}

export enum OrderAction {
  SUBMIT_ORDER = 'SUBMIT_ORDER',
  EXECUTE_ORDER = 'EXECUTE_ORDER',
  CANCELLED = 'CANCEL_ORDER',
}
