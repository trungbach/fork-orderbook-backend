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
import { OrderMiddleware } from './middlewares/order.middleware';
import { UserVolumeController } from './controllers/user_volume.controller';
import { UserVolumeService } from './services/user_volume.service';

@Module({
  controllers: [
    OrderController,
    UserController,
    CandleController,
    UserVolumeController,
  ],
  imports: [],
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

    // consumer.apply(OrderMiddleware).forRoutes(
    //   {
    //     path: '/v1/orders/products/:product_id*',
    //     method: RequestMethod.GET,
    //   },
    // );

    consumer.apply(CandleMiddleware).forRoutes(
      {
        path: '/v1/candle*',
        method: RequestMethod.GET,
      },
    );
  }
}
