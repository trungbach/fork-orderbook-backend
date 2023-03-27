import PostgresDB from '../../config/postgres';
import { PairOraiUsdt } from '../../entities/postgre';

export const PariOraiUsdtRepository = PostgresDB.getRepository(
  PairOraiUsdt,
).extend({});
