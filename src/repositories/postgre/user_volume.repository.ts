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
        .andWhere('user_volume.time <= :endTime', { endTime })
        .leftJoin('o_user', 'user', 'user.id = user_volume.user_id')
        .select([
          'user_volume.time AS time',
          'user_volume.user_id AS user_id',
          'user_volume.product_id AS product_id',
          'user_volume.volume AS volume',
          'user.address AS address',
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
