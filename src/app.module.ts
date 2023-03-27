import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrawlRpcModule } from 'src/modules/crawl-rpc/crawl-rpc.module';
import { SeedCommand } from './commands';
import config from './config';
import { postgresConfig } from './config/postgres';

// import and provider run all commands and run server
let importModules = [
  CrawlRpcModule,
  TypeOrmModule.forRoot(postgresConfig)
] as any[];

let providerModule = [

];

if (config.isRunCmd) { // run command line
  importModules = importModules.concat([

  ]);
  providerModule = providerModule.concat([
    SeedCommand
  ]);
} else { // run server
  importModules = importModules.concat([
    ScheduleModule.forRoot(),
  ]);
}

@Module({
  imports: importModules,
  controllers: [],
  providers: providerModule,
})
export class AppModule {}
