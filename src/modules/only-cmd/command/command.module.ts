import {  Module } from '@nestjs/common';
import {
  SeedCmd
} from './provider'

@Module({
  controllers: [],
  providers: [
    SeedCmd,
  ],
  imports: [],
})
export class CommandModule { }
