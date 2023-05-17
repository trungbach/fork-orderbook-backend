import { ApiProperty } from '@nestjs/swagger';
import { Transform, Expose, Type } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { trim } from 'lodash';
import { OrderSide, OrderStatus } from 'src/utils/constant';

export class OrdersDto {
  @Expose()
  @Type(() => OrderDto)
  orders: OrderDto[];
}

export class OrderDto {
  @Expose({ name: 'id' })
  id: number;

  @Expose({ name: 'price' })
  price: number;

  @Expose({ name: 'ask_amount' })
  ask_amount: string;

  @Expose({ name: 'side' })
  side: number;

  @Expose({ name: 'status' })
  status: number;

  @Expose({ name: 'trade_sequence' })
  trade_sequence: number;

  @Expose()
  time: number;

  @Expose({ name: 'offer_amount' })
  offer_amount: string;
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
    name: 'order_side[]',
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
    name: 'order_status[]',
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
