import {
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export const CreatedAt = (option = { select: true }) =>
  CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    nullable: true,
    precision: 0,
    select: option.select,
    default: () => 'CURRENT_TIMESTAMP',
  });

export const UpdatedAt = (option = { select: true }) =>
  UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    nullable: true,
    precision: 0,
    select: option.select,
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  });
