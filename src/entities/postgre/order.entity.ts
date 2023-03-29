import { 
  Entity,
  PrimaryGeneratedColumn,
  Column
} from 'typeorm';
import { CreatedAt, UpdatedAt } from './base';

@Entity('o_order')
export class Order {
  @PrimaryGeneratedColumn({
    unsigned: true
  })
  id: number;

  @Column({
    name: 'product_id'
  })
  productId: string;

  @Column({
    type: 'decimal',
    precision: 32,
    scale: 16
  })
  price: number

  @Column({
    type: 'decimal',
    precision: 32,
    scale: 16
  })
  amount: number

  @Column()
  side: number

  @Column({
    type: 'timestamp',
  })
  time: Date

  @CreatedAt()
  created_at?: Date;

  @UpdatedAt()
  updated_at?: Date;
}
