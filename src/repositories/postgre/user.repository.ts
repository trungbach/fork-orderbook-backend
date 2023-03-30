import PostgresDB from '../../config/postgres';
import { User } from '../../entities/postgre';

export const UserRepository = PostgresDB.getRepository(User).extend({
  async findOrCreate(humanAddr: string) {
    let user = await this.findOneBy({
      address: humanAddr,
    });
    if (user) {
      return user.id;
    }
    user = UserRepository.create({
      address: humanAddr,
    });
    user = await UserRepository.save(user);
    return user.id;
  },
});
