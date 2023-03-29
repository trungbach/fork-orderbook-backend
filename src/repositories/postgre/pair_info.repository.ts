import PostgresDB from '../../config/postgres';
import { PairInfo } from '../../entities/postgre';

export const PariOraiUsdtRepository = PostgresDB.getRepository(
  PairInfo,
).extend({});
