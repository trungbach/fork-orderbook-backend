import { BOT_ADDRESSES } from 'src/utils/constant';
import PostgresDB from '../../config/postgres';
import { UserVolume } from '../../entities/postgre';

export const UserVolumeRepository = PostgresDB.getRepository(UserVolume).extend(
  {
    findTopUserVolumes(
      granularity: number,
      productId: number,
      startTime: number,
      endTime: number,
    ) {
      const qb = this.createQueryBuilder('user_volume')
        .where('user_volume.product_id = :product_id', {
          product_id: productId,
        })
        .andWhere('user_volume.granularity = :granularity', { granularity })
        .andWhere('user_volume.time >= :startTime', { startTime })
        .andWhere('user_volume.time < :endTime', { endTime })
        .andWhere('user.address NOT IN (:...addresses)', {
          addresses: BOT_ADDRESSES,
        })
        .leftJoin('o_user', 'user', 'user.id = user_volume.user_id')
        .groupBy('user_volume.user_id')
        .addGroupBy('user.address')
        .orderBy('total_volume', 'DESC')
        .select([
          'SUM(user_volume.volume) AS total_volume',
          'user.address as address',
          'user_volume.user_id AS user_id',
        ]);

      const volumes = qb.getRawMany();
      return volumes;
    },

    findLastUserVolume(
      productId: number,
      address: string,
      granularity: number,
    ) {
      const qb = this.createQueryBuilder('user_volume')
        .where('user_volume.product_id = :product_id', {
          product_id: productId,
        })
        .andWhere('user_volume.granularity = :granularity', { granularity })
        .andWhere('user.address = :address', { address })
        .leftJoin('o_user', 'user', 'user.id = user_volume.user_id')
        .orderBy('user_volume.time', 'DESC')
        .select([
          'user_volume.volume AS volume',
          'user_volume.granularity AS granularity',
          'user.address AS address',
        ])
        .limit(1);

      const lastUserVolume = qb.getRawOne();
      return lastUserVolume;
    },
  },
);
