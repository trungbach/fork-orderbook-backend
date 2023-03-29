import {
  Controller,
  Get,
} from '@nestjs/common';
import { ProductRepository } from 'src/repositories/postgre';

@Controller('product')
export class ProductController {
  constructor() { }

  @Get('list')
  getlList() {
    return ProductRepository.find();
  }
}
