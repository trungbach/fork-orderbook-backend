import { Order } from 'src/entities/postgre';
import { OrdereRepository } from 'src/repositories/postgre';

const seeds: Order[] = [
  {
    id: 1,
    productId: 1,
    price: 1,
    userId: 1,
    amount: 100,
    side: 1,
    time: new Date(),
    
  },
  {
    id: 2,
    productId: 1,
    price: 1,
    userId: 1,
    amount: 100,
    side: 1,
    time: new Date(),
  },
  {
    id: 3,
    productId: 1,
    price: 1,
    userId: 1,
    amount: 100,
    side: 1,
    time: new Date(),
  },
];

export class CandleSeed {
  async run() {
    for await (const item of seeds) {
      await this.insertCandle(item);
    }

    console.log('Seed candles success');
  }

  async insertCandle(item: Order) {
    const itemDb = await OrdereRepository.findOne({
      where: {
        id: item.id,
      },
    });

    if (!itemDb) {
      const newItem = OrdereRepository.create(item);
      await OrdereRepository.save(newItem);
    }
  }
}
