import { 
  Entity,
  PrimaryGeneratedColumn,
  Column
} from 'typeorm';
import { CreatedAt, UpdatedAt } from './base';

@Entity('o_user')
export class User {
  @PrimaryGeneratedColumn({
    unsigned: true
  })
  id: number;

  @Column()
  address: string;

  @CreatedAt()
  created_at: moment.Moment;

  @UpdatedAt()
  updated_at: moment.Moment;
}
