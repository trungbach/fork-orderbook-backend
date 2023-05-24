import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import {
  OrderController,
  UserController,
  CandleController,
} from './controllers';
import { CandleMiddleware } from './middlewares/candle.middleware';
import { PaginationMiddleware } from './middlewares/pagination.middleware';
import { OrderService, UserService, CandleService } from './services';
import { UserVolumeController } from './controllers/user_volume.controller';
import { UserVolumeService } from './services/user_volume.service';
import { HttpModule } from '@nestjs/axios';
import { OrderbookController } from './controllers/orderbook.controller';

@Module({
  controllers: [
    OrderController,
    OrderbookController,
    UserController,
    CandleController,
    UserVolumeController,
  ],
  imports: [HttpModule],
  providers: [CandleService, OrderService, UserService, UserVolumeService],
  exports: [],
})
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PaginationMiddleware).forRoutes(
      {
        path: '/v1/orders/users/:address*',
        method: RequestMethod.GET,
      },
      {
        path: '/v1/orders/products/:product_id*',
        method: RequestMethod.GET,
      },
    );

    consumer.apply(CandleMiddleware).forRoutes({
      path: '/v1/candle*',
      method: RequestMethod.GET,
    });
  }
}
