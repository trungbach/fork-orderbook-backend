import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { CreatedAt, UpdatedAt } from './base';

@Entity('o_order')
export class Order {
  @PrimaryGeneratedColumn({
    unsigned: true,
  })
  id: number;

  @Column({
    name: 'product_id',
    type: 'int8',
  })
  productId: number;

  @Column({
    type: 'decimal',
    precision: 32,
    scale: 16,
  })
  price: number;

  @Column({
    type: 'decimal',
    precision: 32,
    scale: 16,
  })
  amount: number;

  @Column()
  side: number;

  @Column({
    type: 'bigint',
  })
  time: number;

  @Column({
    type: 'int',
    name: 'user_id',
  })
  userId: number;

  @Column({
    type: 'int',
    name: 'status',
  })
  status: number;

  @Column({
    type: 'int',
    name: 'trade_sequence',
  })
  tradeSequence: number;

  @CreatedAt()
  created_at?: Date;

  @UpdatedAt()
  updated_at?: Date;

  constructor(
    productId: number,
    userId: number,
    price: number,
    amount: number,
    time: number,
    tradeSequence: number,
    side: number,
    status: number,
  ) {
    this.productId = productId;
    this.userId = userId;
    this.price = price;
    this.amount = amount;
    this.time = time;
    this.tradeSequence = tradeSequence;
    this.side = side;
    this.status = status;
  }
}
