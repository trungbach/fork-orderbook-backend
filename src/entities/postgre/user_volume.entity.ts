import { Column, Entity } from 'typeorm';

@Entity('o_user_volume')
export class UserVolume {
  @Column({
    name: 'id',
    primary: true,
  })
  id: number;

  @Column({
    name: 'user_id',
  })
  userId: number;

  @Column({
    name: 'product_id',
  })
  productId: number;

  @Column('int', {
    name: 'granularity',
  })
  granularity: number;

  @Column('decimal', {
    precision: 32,
    scale: 16,
    name: 'volume',
  })
  volume: number;

  @Column('bigint')
  time: number;
}
