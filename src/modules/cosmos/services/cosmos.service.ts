import { Injectable } from '@nestjs/common';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { decodeTxRaw, Registry } from '@cosmjs/proto-signing';
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx';
import { MsgSend } from 'cosmjs-types/cosmos/bank/v1beta1/tx';
import { defaultRegistryTypes } from '@cosmjs/stargate';
import config from 'src/config';

@Injectable()
export class CosmosService {
  public async client() {
    return await CosmWasmClient.connect(config.RPC_URL);
  }

  public async getLatestBlock(height?: number) {
    const client = await this.client();
    return client.getBlock(height);
  }

  /**
   * decode TXS UINT8, base64
   *
   * @param base64
   * @param filterType
   * @returns
   */
  decodeMessage(base64, filterType?: string) {
    const registry = new Registry(defaultRegistryTypes);
    registry.register(
      '/cosmwasm.wasm.v1.MsgExecuteContract',
      MsgExecuteContract,
    );
    registry.register(
      '/cosmwasm.wasm.v1beta1.MsgExecuteContract',
      MsgExecuteContract,
    );
    registry.register('/cosmos.bank.v1beta1.MsgSend', MsgSend);
    // const uintArr = Buffer.from(base64, 'base64');
    const decode_body = decodeTxRaw(base64).body;
    const returnData: any[] = [];
    for (const message of decode_body.messages) {
      const typeUrl = message.typeUrl.substring(1);
      if (filterType && typeUrl !== filterType) return;
      const value = registry.decode(message);
      const msg = JSON.parse(Buffer.from(value.msg).toString());
      // decode msg base64
      returnData.push(value);
    }

    return {
      data: returnData,
      memo: decode_body?.memo,
    };
  }
}
