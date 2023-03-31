interface OrderEvent {
  productId: number; 
  userId: number;
  price: number; // amount ask / amount offer 
  amount: number; // is number ask_asset field 
  time: string; // is time of block
  tradeSequence: number; // is order_id field
  side: number; // is direction field
  action: string;
}

export { OrderEvent };
