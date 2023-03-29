import PostgresDB from '../../config/postgres';
import { Product } from '../../entities/postgre';

export const ProductRepository = PostgresDB.getRepository(Product).extend({});
