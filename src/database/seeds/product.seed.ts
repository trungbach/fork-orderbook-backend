import { Product } from 'src/entities/postgre';
import { ProductRepository } from 'src/repositories/postgre';

const seeds: Product[] = [
  {
    id: 1,
    symbol: 'ORAI/USDT',
    slippage: 0,
    from: 'orai',
    to: 'orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh',
  },
  {
    id: 2,
    symbol: 'ORAI/ATOM',
    slippage: 0,
    from: 'orai',
    to: 'ibc/A2E2EEC9057A4A1C2C0A6A4C78B0239118DF5F278830F50B4A6BDD7A66506B78'
  },
  {
    id: 3,
    symbol: 'ORAI/OSMO',
    slippage: 10,
    from: 'orai',
    to: 'ibc/9C4DCD21B48231D0BC2AC3D1B74A864746B37E4292694C93C617324250D002FC'
  }
];

export class ProductSeed {
  async run() {
    for await (const item of seeds) {
      await this.insertProduct(item);
    }

    console.info('Seed product success');
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
