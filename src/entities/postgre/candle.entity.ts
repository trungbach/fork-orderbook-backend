import { Column, Entity } from 'typeorm';
import { PairTable } from './base';

@Entity('o_candle')
export class Candle extends PairTable {
  @Column({
    name: 'candle_id',
  })
  candle_id: string;

  @Column({
    name: 'product_id',
  })
  productId: string;

  @Column('int8', {
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

  @Column()
  time: number;
}
