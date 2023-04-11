import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductRepository } from 'src/repositories/postgre';
import { Redis } from 'src/utils';
import { TICKER_PRICE } from 'src/utils/constant';

@ApiTags('Products')
@Controller('product')
export class ProductController {

  @Get('list')
  async getlList() {
    return ProductRepository.find();
  }

  @Get(':product_id/current_price')
  async getCurrentPrice(@Param('product_id') product_id: number) {
    const redis = await Redis.getInstance();
    const price = await redis.get(`${product_id}.${TICKER_PRICE}`) || 0;
    return {
      product_id: price,
    };
  }
}
