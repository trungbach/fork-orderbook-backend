import { Product } from 'src/entities/postgre';

export class ProductDto {
  id: number;
  symbol: string;
  slippage: number;

  constructor(product: Product) {
    this.id = product.id;
    this.slippage = product.slippage;
    this.symbol = product.symbol;
  }
}
