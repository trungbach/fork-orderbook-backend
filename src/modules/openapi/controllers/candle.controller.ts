import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CandleService } from '../services/candle.service';

@ApiTags('Candles')
@Controller('/v1/candles')
export class CandleController {
  constructor(private readonly candleService: CandleService) {}

  @Get('/:product_id')
  async listCandleByGranularity(
    @Param('product_id') product_id: number,
    @Query('granularity') granularity: number,
    @Query('startTime') startTime: number,
    @Query('endTime') endTime: number,
  ) {
    return await this.candleService.getCandlesByProduct(
      product_id,
      granularity,
      startTime,
      endTime,
    );
  }
}
