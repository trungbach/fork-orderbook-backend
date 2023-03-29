import {
  Controller,
  Get,
} from '@nestjs/common';
import { ProductRepository } from 'src/repositories/postgre';

@Controller('product')
export class ProductController {
  @Get('list')
  async getlList() {
    return ProductRepository.find();
  }
}
