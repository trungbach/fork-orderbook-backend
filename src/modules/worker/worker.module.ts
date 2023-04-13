import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { CandleConsumer } from './consumers/candle-consumer';
import { OrderConsumer } from './consumers/order-consumer';

@Module({
  controllers: [],
  providers: [CandleConsumer, OrderConsumer],
  imports: [
    BullModule.registerQueue({
      name: 'order-queue',
    }),
    BullModule.registerQueue({
      name: 'candle-queue',
    }),
  ],
})
export class WorkerModule {}
