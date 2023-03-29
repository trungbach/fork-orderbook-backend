import { PariOraiUsdtRepository } from 'src/repositories/postgre';

const CHAIN = [
  {
    id: 1,
  },
];

export class PairOraiUsdtSeed {
  async run() {
    for await (const item of CHAIN) {
      await this.insertPair(item);
    }
    console.log('Seed chain success');
  }

  async insertPair(item: any) {
    const itemDb = await PariOraiUsdtRepository.findOne({
      where: {
        id: item.id,
      },
    });
    if (!itemDb) {
      const newItem = PariOraiUsdtRepository.create(item);
      console.log('seed pair item', newItem);
      await PariOraiUsdtRepository.save(newItem);
    }
  }
}
