import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from './config';
import { postgresConfig } from './config/postgres';
import { BullModule } from '@nestjs/bull';
import { CrawlRpcModule } from './modules/crawl-rpc/crawl-rpc.module';
import { CommandModule } from './modules/only-cmd/command/command.module';

// import and provider run all commands and run server
let importModules = [
  CrawlRpcModule,
  TypeOrmModule.forRoot(postgresConfig),
] as any[];

if (config.isRunCmd) { // run command line
  importModules = importModules.concat([
    CommandModule
  ]);
} else { // run web
  importModules = importModules.concat([
    ScheduleModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: config.redis.host,
        port: +config.redis.port,
      },
    }),
  ]);
}

@Module({
  imports: importModules,
  controllers: [],
  providers: [],
})
export class AppModule {}
