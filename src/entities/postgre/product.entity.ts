import { 
  Entity,
  PrimaryGeneratedColumn,
  Column
} from 'typeorm';
import { CreatedAt, UpdatedAt } from './base';
import * as moment from 'moment'

@Entity('o_product')
export class Product {
  @PrimaryGeneratedColumn({
    unsigned: true
  })
  id: number;

  @Column()
  symbol: string;

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
