import { Product } from 'src/entities/postgre';
import { ProductRepository } from 'src/repositories/postgre';

const seeds: Product[] = [
  {
    id: 1,
    symbol: 'ORAI/ATOM',
    slippage: 0,
    from: '',
    to: '',
  },
  {
    id: 2,
    symbol: 'ORAI/USDT',
    slippage: 0,
    from: '',
    to: '',
  },
  {
    id: 3,
    symbol: 'ORAI/ORAIX',
    slippage: 0,
    from: '',
    to: '',
  },
  {
    id: 4,
    symbol: 'ORAI/AIRI',
    slippage: 0,
    from: '',
    to: '',
  },
  {
    id: 5,
    symbol: 'ORAI/scORAI',
    slippage: 0,
    from: '',
    to: '',
  },
  {
    id: 6,
    symbol: 'ORAI/KWT',
    slippage: 0,
    from: '',
    to: '',
  },
  {
    id: 7,
    symbol: 'ORAI/USDC',
    slippage: 0,
    from: '',
    to: '',
  },
  {
    id: 8,
    symbol: 'ORAI/OSMO',
    slippage: 0,
    from: '',
    to: '',
  },
  {
    id: 9,
    symbol: 'MILKY/USDT',
    slippage: 0,
    from: '',
    to: '',
  },
];

export class ProductSeed {
  async run() {
    for await (const item of seeds) {
      await this.insertProduct(item);
    }

    console.log('Seed product success');
  }

  async insertProduct(item: Product) {
    const itemDb = await ProductRepository.findOne({
      where: {
        id: item.id,
      },
    });

    if (!itemDb) {
      const newItem = ProductRepository.create(item);
      await ProductRepository.save(newItem);
    }
  }
}
