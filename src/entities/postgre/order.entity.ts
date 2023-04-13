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
    name: 'ask_amount',
    type: 'decimal',
    precision: 32,
    scale: 16,
  })
  askAmount: number;

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

  @Column({
    name: 'offer_amount',
    type: 'decimal',
    precision: 32,
    scale: 16,
  })
  offerAmount: number;

  @CreatedAt()
  created_at?: Date;

  @UpdatedAt()
  updated_at?: Date;

  constructor(
    productId: number,
    userId: number,
    price: number,
    askAmount: number,
    time: number,
    tradeSequence: number,
    side: number,
    status: number,
    offerAmount: number,
  ) {
    this.productId = productId;
    this.userId = userId;
    this.price = price;
    this.askAmount = askAmount;
    this.time = time;
    this.tradeSequence = tradeSequence;
    this.side = side;
    this.status = status;
    this.offerAmount = offerAmount;
  }
}
