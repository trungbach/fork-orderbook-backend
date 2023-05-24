import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { CreatedAt, UpdatedAt } from './base';

@Entity('o_product')
export class Product {
  @PrimaryGeneratedColumn({
    unsigned: true,
  })
  id: number;

  @Column()
  symbol: string;

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 5,
    default: 0,
  })
  slippage: number;

  @Column()
  from: string;

  @Column()
  to: string;

  @Column({
    name: 'contract_address',
    type: 'varchar',
  })
  contractAddress: string;

  @CreatedAt()
  created_at?: Date;

  @UpdatedAt()
  updated_at?: Date;
}
