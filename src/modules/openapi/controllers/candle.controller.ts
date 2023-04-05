import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { CandleService } from '../services/candle.service';

@ApiTags('Candles')
@Controller('/v1/candles')
export class CandleController {
  constructor(private readonly candleService: CandleService) {}

  @ApiParam({
    name: 'product_id',
    required: true,
    description: 'query by product id',
    type: Number
  })
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
