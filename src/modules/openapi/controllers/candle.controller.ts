import { Controller, Param, Query } from "@nestjs/common";
import { CandleService } from "../services/candle.service";

@Controller('candles')
export class CandleController {
    constructor(
        private readonly candleService: CandleService,
    ){}

    async listCandleByGranularity(
        @Param('product_id')product_id: number,
        @Query('granularity') granularity: number,
        @Query('startTime') startTime: number,
        @Query('endTime') endTime: number
    ){
        return await this.candleService.getCandlesByProduct(product_id, granularity, startTime, endTime);
    }
}