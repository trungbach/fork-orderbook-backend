import { Entity, Column, PrimaryColumn } from 'typeorm';
import { CreatedAt } from './base';

@Entity('o_txs')
export class Txs {
  @PrimaryColumn()
  hash: string;

  @Column()
  height: number;

  @Column({
    type: 'timestamp',
  })
  time: Date;

  @Column()
  data?: string;

  @CreatedAt()
  created_at?: Date;
}
