import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { CandleConsumer } from './consumers/candle-consumer';
import { OrderConsumer } from './consumers/order-consumer';
import { TradeConsumer } from './consumers/trade-consumer';

@Module({
  controllers: [],
  providers: [CandleConsumer, OrderConsumer, TradeConsumer],
  imports: [
    BullModule.registerQueue({
      name: 'order-queue',
    }),
    BullModule.registerQueue({
      name: 'candle-queue',
    }),
    BullModule.registerQueue({
      name: 'trade-queue',
    }),
  ],
})
export class WorkerModule {}
