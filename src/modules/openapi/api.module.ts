import { Module } from '@nestjs/common';
import { OrderController, UserController } from './controllers';
import { OrderService, UserService } from './services';
import { CandleService } from './services/candle.service';

@Module({
  controllers: [OrderController, UserController],
  imports: [],
  providers: [CandleService, OrderService, UserService],
  exports: [],
})
export class ApiModule {}
