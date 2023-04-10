class OrderEvent {
  productId: number;
  userId: number;
  price: number; // amount offer / ask (side = Buy) or amount ask / offer (side = Sell)
  amount: number; // is number ask_asset field
  volume: number; // is number offer (side = buy) or ask (side = sell)
  time: string; // is time of block
  tradeSequence: number; // is order_id field
  side: number; // is direction field
  action: string;
  tradeStatus?: string;
}

export { OrderEvent };
