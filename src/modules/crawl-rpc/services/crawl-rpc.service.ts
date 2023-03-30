import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import config from 'src/config';
import { Redis, sleep } from 'src/utils';
import { CosmosService, TxsFromBlocks } from 'src/modules/cosmos/services';
import { logErrorConsole } from 'src/utils/log-provider';
import { TypeEventWasm } from './type-event-wasm.service';
import { TxsBasic } from '../dtos';

const REDIS_KEY_LAST_BLOCK = 'last_scan_block';

@Injectable()
export class CrawlRpcService {
  private lastScanBlock: number;
  private maxLimit = 10;
  private textLogNote = '---- run cosmos';
  private redis: any;

  constructor(
    private readonly cosmosServ: CosmosService,
    private readonly typeEventWasmServ: TypeEventWasm,
  ) {}

  /**
   * run scan all block
   */
  public async runMain() {
    this.redis = await Redis.getInstance();
    await this.getLastScanBlock();
    await this.scanBlock();
  }

  private async getLastScanBlock(): Promise<void> {
    if (this.lastScanBlock) {
      return;
    }

    // get from redis
    this.lastScanBlock = await this.redis.get(REDIS_KEY_LAST_BLOCK);
    if (this.lastScanBlock) {
      this.lastScanBlock = Number(this.lastScanBlock);
      return;
    }
    // get from db
    // TODO get last db

    // get from env
    if (config.LAST_SCAN_BLOCK) {
      this.lastScanBlock = Number(config.LAST_SCAN_BLOCK);
      return;
    }

    // default = 1
    this.lastScanBlock = 1;
  }

  private async scanBlock() {
    try {
      await this.scanBlockRecursive();
    } catch (err) {
      logErrorConsole(this.textLogNote, 'Run timeout again', err);
      await sleep(10000);
      await this.scanBlock();
    }
  }

  private async scanBlockRecursive() {
    const newBlock = (await this.cosmosServ.getLatestBlock()).header.height;
    console.log(
      this.textLogNote,
      moment().format('YYYY-MM-DD HH:mm:ss'),
      'lastBlockHeight',
      newBlock,
      this.lastScanBlock,
    );

    const previousOffset = 1; //rescan number block
    const offset = newBlock - this.lastScanBlock;
    if (offset > 0) {
      const step = Math.min(this.maxLimit, offset);
      const limit = step + previousOffset;
      await this.processTxt(limit, previousOffset);

      this.lastScanBlock += step;
      await this.redis.set(REDIS_KEY_LAST_BLOCK, this.lastScanBlock);
    }

    // scan to new block in blockchain -> sleep block time
    if (this.lastScanBlock === newBlock) {
      console.log(this.textLogNote, 'Run Interval');
      await sleep(7000);
      return this.scanBlockRecursive();
    }
    // scan not util to last block in blockchain -> sleep 1s
    console.log(this.textLogNote, 'Run Immediate continue miss scan');
    await sleep(1500);
    return this.scanBlockRecursive();
  }

  private async processTxt(limit: number, previousOffset: number) {
    const txsServ = new TxsFromBlocks(this.cosmosServ);
    const txsList = await txsServ.getTxs(
      // TODO
      this.lastScanBlock - previousOffset,
      // 10924952,
      limit,
    );
    // Loop through each Blocks
    for (const item of txsList) {
      for (const txs of item.txs) {
        if (!txs?.tx_result?.log) {
          continue;
        }
        await this.typeEventWasmServ.execEventOrderFromLog(
          txs?.tx_result?.log,
          {
            time: item.time,
            hash: txs.hash,
            height: Number(txs.height),
          } as TxsBasic,
        );
      }
      // for (const message of messages) {
      //   await this.nftEventJobService.processMessage(
      //     message,
      //     height,
      //     forceCheckTxt,
      //     time,
      //   );
      // }
    }
  }
}
