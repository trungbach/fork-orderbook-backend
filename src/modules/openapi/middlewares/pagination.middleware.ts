import { Injectable, NestMiddleware } from '@nestjs/common';
import { convertPageToOffset } from '../utils/convert-pagination';
import { Request, Response, NextFunction } from 'express';


@Injectable()
export class PaginationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const page = +req?.query?.page || 10;
    const size = +req?.query?.size || 1;
    const [limit, offset] = convertPageToOffset(page, size);
    const pagination: any = {};

    pagination.limit = limit;
    pagination.offset = offset;

    if (req?.query?.sort) {
      pagination.sort = req.query.sort;
    }

    req['pagination']= pagination;
    next();
  }
}
