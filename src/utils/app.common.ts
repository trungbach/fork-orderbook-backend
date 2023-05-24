import { RequestTimeoutException } from '@nestjs/common';
import { OrderDirectionContract } from './constant';

export const sleep = async (time = 10000) => {
  await new Promise((resolve) => setTimeout(() => resolve(true), time));
};

export const fetchWithTimeout = async (
  url: string,
  options: any,
  timeout = 10000,
) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(
        () => reject(new RequestTimeoutException(url || 'timeout')),
        timeout,
      ),
    ),
  ]);
};

export const validateOraiAddress = (address: string): boolean => {
  const addressLength = address.length;
  if (addressLength === 43 || addressLength === 63) {
    return true;
  }
  return false;
};

export type AssetInfo =
  | {
      token: {
        contract_addr: string;
      };
    }
  | {
      native_token: {
        denom: string;
      };
    };

export interface Asset {
  amount: string;
  info: AssetInfo;
}

export interface OrderContract {
  order_id: number;
  status: string;
  direction: string;
  bidder_addr: string;
  offer_asset: Asset;
  ask_asset: Asset;
  filled_offer_amount: string;
  filled_ask_amount: string;
}

// first: price in usd, second: amount
export type TransformDataResponse = [string, string];

export const transformOrderContract = (
  orders: OrderContract[],
  direction: OrderDirectionContract,
): TransformDataResponse[] => {
  const transformedOrders: TransformDataResponse[] = [];
  if (direction === OrderDirectionContract.SELL) {
    orders.forEach((order) => {
      transformedOrders.push([
        (+order.ask_asset.amount / +order.offer_asset.amount).toString(),
        (+order.offer_asset.amount / Math.pow(10, 6)).toString(),
      ]);
    });
  } else {
    orders.forEach((order) => {
      transformedOrders.push([
        (+order.offer_asset.amount / +order.ask_asset.amount).toString(),
        (+order.ask_asset.amount / Math.pow(10, 6)).toString(),
      ]);
    });
  }

  return transformedOrders;
};
