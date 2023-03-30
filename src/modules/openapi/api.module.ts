import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { OrderController, UserController } from './controllers';
import { CandleController } from './controllers/candle.controller';
import { CandleMiddleware } from './middlewares/candle.middleware';
import { PaginationMiddleware } from './middlewares/pagination.middleware';
import { OrderService, UserService } from './services';
import { CandleService } from './services/candle.service';

@Module({
  controllers: [OrderController, UserController, CandleController],
  imports: [],
  providers: [CandleService, OrderService, UserService],
  exports: [],
})
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PaginationMiddleware).forRoutes(
      {
        path: '/v1/orders/users*',
        method: RequestMethod.GET,
      },
      {
        path: '/v1/orders/products*',
        method: RequestMethod.GET,
      },
    );

    consumer.apply(CandleMiddleware).forRoutes({
      path: '/v1/candle*',
      method: RequestMethod.GET,
    });
  }
}
