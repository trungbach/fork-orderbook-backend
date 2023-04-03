import PostgresDB from '../../config/postgres';
import { Txs } from '../../entities/postgre';

export const TxsRepository = PostgresDB.getRepository(Txs).extend({});
