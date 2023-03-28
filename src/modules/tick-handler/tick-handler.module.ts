import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { CandleConsumer } from './consumers/candle-consumer';

@Module({
  controllers: [],
  providers: [CandleConsumer],
  imports: [
    BullModule.registerQueue({
      name: 'tick-marker',
    }),
  ],
})
export class TickHandlerModule {}
