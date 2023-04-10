import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { trim } from 'lodash';
import { Order } from 'src/entities/postgre';
import { OrderSide, OrderStatus } from 'src/utils/constant';

export class OrderDto {
  id: number;
  price: number;
  amount: number;
  side: number;
  status: number;
  trade_sequence: number;
  time: number;

  constructor(order: Order) {
    this.id = order.id;
    this.price = +order.price;
    this.amount = +order.amount;
    this.side = +order.side;
    this.status = +order.status;
    this.time = +order.time;
    this.trade_sequence = +order.tradeSequence;
  }
}

export class QueryOrderDto {
  @ApiProperty({
    name: 'address',
    description: 'Orai address',
    required: false,
  })
  @Transform(({ value }) => trim(value))
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    name: 'order_side',
    description: 'side of order',
    required: false,
    enum: OrderSide,
    isArray: true,
  })
  @IsArray()
  @IsOptional()
  @IsEnum(OrderSide, { each: true })
  order_side?: OrderSide[];

  @ApiProperty({
    name: 'order_status',
    description: 'status of order',
    required: false,
    enum: OrderStatus,
    isArray: true,
  })
  @IsArray()
  @IsOptional()
  @IsEnum(OrderStatus, { each: true })
  order_status?: OrderStatus[];
}
