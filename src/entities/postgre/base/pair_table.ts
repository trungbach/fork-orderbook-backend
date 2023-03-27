import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { CreatedAt, UpdatedAt } from './index';

export class PairTable {
  @PrimaryGeneratedColumn({
    unsigned: true
  })
  id: number;

  @CreatedAt()
  created_at: Date;

  @UpdatedAt()
  updated_at: Date;
}
