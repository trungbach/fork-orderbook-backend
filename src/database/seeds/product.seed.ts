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
