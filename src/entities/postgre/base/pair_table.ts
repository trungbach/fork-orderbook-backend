import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { CreatedAt, UpdatedAt } from './index';
import * as moment from 'moment';

export class PairTable {
  @PrimaryGeneratedColumn({
    unsigned: true
  })
  id: number;

  @Column({
    type: 'float'
  })
  o: number;

  @Column({
    type: 'float'
  })
  h: number;

  @Column({
    type: 'float'
  })
  l: number;

  @Column({
    type: 'float'
  })
  c: number;

  @Column({
    type: 'float'
  })
  volume: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  time: moment.Moment

  @CreatedAt()
  created_at: moment.Moment;

  @UpdatedAt()
  updated_at: moment.Moment;
}
