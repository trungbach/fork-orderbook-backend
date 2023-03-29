import { Column, Entity } from 'typeorm';

@Entity('o_candle')
export class Candle {
  @Column({
    name: 'id',
    primary: true,
  })
  id: number;

  @Column({
    name: 'product_id',
  })
  productId: number;

  @Column('bigint', {
    name: 'granularity',
  })
  granularity: number;

  @Column('decimal', {
    precision: 32,
    scale: 16,
  })
  open: number;

  @Column('decimal', {
    precision: 32,
    scale: 16,
  })
  close: number;

  @Column('decimal', {
    precision: 32,
    scale: 16,
  })
  high: number;

  @Column('decimal', {
    precision: 32,
    scale: 16,
  })
  low: number;

  @Column('decimal', {
    precision: 32,
    scale: 16,
  })
  volume: number;

  @Column('bigint')
  time: number;
}
