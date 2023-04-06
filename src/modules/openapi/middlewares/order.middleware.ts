import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { validateOraiAddress } from 'src/utils';
import { OrderStatusParams } from 'src/utils/constant';

@Injectable()
export class OrderMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const status = req?.query?.status as string;
    const address = req?.query?.address as string;

    if (address && status) {
      if (OrderStatusParams[status] && validateOraiAddress(address)) {
        req.query['status'] = OrderStatusParams[status];
        next();
      } else {
        throw new BadRequestException('Invalid request');
      }
    } else if (status && OrderStatusParams[status]) {
      req.query['status'] = OrderStatusParams[status];
      next();
    } else if (address && validateOraiAddress(address)) {
      next();
    } else if (!status && !address) {
      next();
    } else {
      throw new BadRequestException('Invalid request');
    }
  }
}
