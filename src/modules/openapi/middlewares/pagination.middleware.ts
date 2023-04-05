import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class PaginationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    let limit = +req?.query?.limit || 30;
    const offset = +req?.query?.offset || 0;

    if (limit < 0 || limit > 50) {
      limit = 50;
    }

    const pagination: any = {};

    pagination.limit = limit;
    pagination.offset = offset;

    if (req?.query?.sort) {
      pagination.sort = req.query.sort;
    }

    req['pagination'] = pagination;
    next();
  }
}
