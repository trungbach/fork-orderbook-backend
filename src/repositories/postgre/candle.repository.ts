import PostgresDB from 'src/config/postgres';
import { Candle } from '../../entities/postgre/candle.entity';

export const CandleRepository = PostgresDB.getRepository(Candle).extend({});
