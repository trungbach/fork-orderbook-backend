import { Processor } from '@nestjs/bull';

@Processor('')
export class TradeConsumer {
  constructor() {}
}
