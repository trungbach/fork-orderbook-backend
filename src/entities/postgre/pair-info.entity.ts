import { 
  Entity,
  PrimaryGeneratedColumn,
  Column
} from 'typeorm';
import { CreatedAt, UpdatedAt } from './base';

@Entity('o_pair_info')
export class PairInfo {
  @PrimaryGeneratedColumn({
    unsigned: true
  })
  id: number;

  @Column()
  from: string;

  @Column()
  to: string;

  @Column({
    name: 'from_name'
  })
  fromName: string;

  @Column({
    name: 'to_name'
  })
  toName: string;

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 5,
    default: 0
  })
  slippage: number

  @CreatedAt()
  created_at: moment.Moment;

  @UpdatedAt()
  updated_at: moment.Moment;
}
