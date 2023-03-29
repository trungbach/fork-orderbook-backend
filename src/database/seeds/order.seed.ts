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
    status: 1
    
  },
  {
    id: 2,
    productId: 1,
    price: 1,
    userId: 1,
    amount: 100,
    side: 1,
    time: new Date(),
    status: 2
  },
  {
    id: 3,
    productId: 1,
    price: 1,
    userId: 1,
    amount: 100,
    side: 1,
    time: new Date(),
    status: 2
  },
];

export class OrderSeed {
  async run() {
    for await (const item of seeds) {
      await this.insertItem(item);
    }

    console.log('Seed Order success');
  }

  async insertItem(item: Order) {
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
