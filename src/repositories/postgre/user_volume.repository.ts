import PostgresDB from '../../config/postgres';
import { UserVolume } from '../../entities/postgre';

export const UserVolumeRepository = PostgresDB.getRepository(UserVolume).extend({

});
