class OrderEvent {
  productId: number;
  userId: number;
  price: number; // amount ask / amount offer (side = Buy) or amount offer/ask (side = Sell)
  amount: number; // is number ask_asset field
  time: string; // is time of block
  tradeSequence: number; // is order_id field
  side: number; // is direction field
  action: string;
  tradeStatus?: string;
}

export { OrderEvent };
