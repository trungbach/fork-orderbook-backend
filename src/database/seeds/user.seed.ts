import { User } from 'src/entities/postgre';
import { UserRepository } from 'src/repositories/postgre';

const seeds: User[] = [
  {
    id: 1,
    address: 'orai1paxwhp9g8e5pqg4l3cd5h8wgv4c68wwpeu2hk8',
  },
  {
    id: 2,
    address: 'orai1tjx70gpxmfdyyeudl992la5nhw3806upaqu0aw',
  },
  {
    id: 3,
    address: 'orai195269awwnt5m6c843q6w7hp8rt0k7syfu9de4h0wz384slshuzps8y7ccm',
  },
];

export class UserSeed {
  async run() {
    for await (const item of seeds) {
      await this.insertItem(item);
    }

    console.info('Seed User success');
  }

  async insertItem(item: User) {
    const itemDb = await UserRepository.findOne({
      where: {
        id: item.id,
      },
    });

    if (!itemDb) {
      const newItem = UserRepository.create(item);
      await UserRepository.save(newItem);
    }
  }
}
