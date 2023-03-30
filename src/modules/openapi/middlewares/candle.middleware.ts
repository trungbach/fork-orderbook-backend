import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as moment from 'moment';

@Injectable()
export class CandleMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const GRANULARITY_ARR = [1, 5, 15, 30, 60, 360, 1440];

    const granularity = +req.query['granularity'];
    const startTime = +req.query['startTime'];
    const endTime = +req.query['endTime'];

    if (!granularity || !startTime || !endTime) {
      throw new ForbiddenException(null, 'Invalid request');
    }

    if (!GRANULARITY_ARR.includes(granularity)) {
      throw new ForbiddenException(null, 'Invalid request');
    }

    if (!moment(startTime).isValid() || !moment(endTime).isValid()) {
      throw new ForbiddenException(null, 'Invalid request');
    }

    next();
  }
}
