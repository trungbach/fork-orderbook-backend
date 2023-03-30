import { Module } from '@nestjs/common';
import { CosmosService } from './services';

@Module({
  controllers: [],
  providers: [CosmosService],
  imports: [],
  exports: [CosmosService],
})
export class CosmosModule {}
