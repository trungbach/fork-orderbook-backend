import PostgresDB from '../../config/postgres';
import { User } from '../../entities/postgre';

export const UserRepository = PostgresDB.getRepository(User).extend({});
