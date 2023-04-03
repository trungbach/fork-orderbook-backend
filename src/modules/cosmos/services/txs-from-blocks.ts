import config from 'src/config';
import { fetchWithTimeout, sleep } from 'src/utils';
import { logErrorConsole } from 'src/utils/log-provider';
import { CosmosService } from './cosmos.service';

interface BlockFetch {
  from?: number;
  to?: number;
  error: number[];
}

class TxsResponse {
  txs: any[] = [];
  txsError: number[] = [];
  promises: Promise<any>[] = [];
}

export class TxsFromBlocks {
  private cosmosServ: CosmosService;
  private txsResponse: TxsResponse;

  constructor(cosmosServ?: CosmosService) {
    if (!cosmosServ) {
      this.cosmosServ = new CosmosService();
    } else {
      this.cosmosServ = cosmosServ;
    }
  }
  /**
   * get txs from rpc, block x->y, error any block -> retry 5 times
   *  hoac khong con block nao loi nua -> done
   *  2 function retry: getTxsRetry, getTxsFetch
   *
   * @param start number
   * @param limit number
   * @returns
   */
  public async getTxs(start: number, limit: number) {
    this.txsResponse = new TxsResponse();

    if (
      (await this.getTxsRetry(
        start,
        {
          from: 0,
          to: limit,
        } as BlockFetch,
        0,
      )) === null
    ) {
      throw Error('Fetch RPC error');
    }
    return this.txsResponse.txs;
  }

  private async getTxsRetry(start: number, options: BlockFetch, retry = 0) {
    this.txsResponse.txsError = [];
    if (retry >= 5) {
      return null;
    }
    if (options.from !== null && options.to !== null) {
      for (let i = options.from; i < options.to; i++) {
        this.getTxsFetch(start + i);
      }
    } else if (options.error.length > 0) {
      for (const i of options.error) {
        this.getTxsFetch(i);
      }
    }
    if (this.txsResponse.promises.length > 0) {
      await Promise.all(this.txsResponse.promises)
        .then((items) => {
          return items;
        })
        .catch((err) => {
          logErrorConsole('error promise all', err);
        });
      this.txsResponse.promises = [];
    }
    if (this.txsResponse.txsError.length > 0) {
      console.info('-----sleep retry ', retry);
      await sleep(3000);
      return await this.getTxsRetry(
        start,
        {
          error: this.txsResponse.txsError,
        } as BlockFetch,
        retry + 1,
      );
    }
    this.txsResponse.txsError = [];
    return this.txsResponse;
  }

  private getTxsFetch(height: number) {
    const url = `${config.RPC_URL}/tx_search?query="tx.height=${height}"&per_page=100`;
    this.txsResponse.promises.push(
      fetchWithTimeout(url, {}, 20000)
        .then((res: any) => res.json())
        .then(async (obj) => {
          if (typeof obj?.result?.txs !== 'object') {
            console.error('-+ txs get error block', obj);
            this.txsResponse.txsError.push(height);
            return true;
          }
          console.info('-+ txs get', height);
          if (obj.result.txs.length === 0) {
            return true;
          }
          const time = (await this.cosmosServ.getLatestBlock(height)).header
            .time;
          this.txsResponse.txs.push({ txs: obj.result.txs, time });
        })
        .catch((err) => {
          logErrorConsole('-+ txs get error cosmos service fetch', err);
          this.txsResponse.txsError.push(height);
        }),
    );
  }
}
