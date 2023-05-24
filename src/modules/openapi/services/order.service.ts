import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/postgre';
import {
  OrdereRepository,
  ProductRepository,
  UserRepository,
} from 'src/repositories/postgre';
import { OrderDto, OrdersDto } from '../models/order.dto';
import { PageList } from '../models/page-list.dto';
import { plainToInstance } from 'class-transformer';
import { HttpService } from '@nestjs/axios';
import { catchError, lastValueFrom, of, retry, map } from 'rxjs';
import { transformOrderContract } from 'src/utils';
import { OrderDirectionContract } from 'src/utils/constant';

@Injectable()
export class OrderService {
  constructor(private readonly httpService: HttpService) {
    //inject
  }

  async getByProduct(
    productId: number,
    limit: number,
    offset: number,
    address?: string,
    status?: string[],
    side?: string[],
  ): Promise<PageList<OrderDto[]>> {
    const product = await ProductRepository.findOne({
      where: { id: productId },
    });
    let user: User = null;

    if (address) {
      user = await UserRepository.findOne({ where: { address } });
    }

    if (!product) {
      return new PageList<OrderDto[]>([]);
    }

    if (address && !user) {
      return new PageList<OrderDto[]>([]);
    }

    const params = {
      productId,
      limit,
      offset,
      ...(address ? { userId: user.id } : {}),
      ...(status?.length ? { status } : {}),
      ...(side?.length ? { side } : {}),
    };

    const orders = await OrdereRepository.findOrderByProduct(params);
    const data = plainToInstance(
      OrdersDto,
      { orders },
      { excludeExtraneousValues: true },
    );

    return new PageList<OrderDto[]>(data.orders);
  }

  async getByAddress(
    address: string,
    limit: number,
    offset: number,
  ): Promise<PageList<OrderDto[]>> {
    const orders = await OrdereRepository.findByAddress(address, limit, offset);
    return new PageList<OrderDto[]>(
      plainToInstance(
        OrdersDto,
        { orders },
        { excludeExtraneousValues: true },
      ).orders,
    );
  }

  async getRecentTraded(
    product_id: number,
    limit: number,
    offset: number,
  ): Promise<PageList<OrderDto[]>> {
    const orders = await OrdereRepository.findRecentTraded(
      product_id,
      limit,
      offset,
    );

    // const items: OrderDto[] = orders.map((order: Order) => new OrderDto(order));
    return new PageList<OrderDto[]>(
      plainToInstance(
        OrdersDto,
        { orders },
        { excludeExtraneousValues: true },
      ).orders,
    );
  }

  async getOpen(product_id: number, side: number) {
    const orders = await OrdereRepository.findOpenOrders(product_id, side);
    return orders;
  }

  async getOrderFromContract(ticker_id: string) {
    const symbol = ticker_id.replace('_', '/');
    const product = await ProductRepository.findOne({ where: { symbol } });
    if (!product) {
      return {};
    }
    const ordersSell = await lastValueFrom(
      this.httpService.get<any>('').pipe(
        map((response) => response.data),
        catchError((err) => of([])),
        retry({
          count: 2,
          resetOnSuccess: true,
        }),
      ),
    );

    const ordersBuy = await lastValueFrom(
      this.httpService.get<any>('').pipe(
        map((response) => response.data as any),
        catchError((err) => of([])),
        retry({
          count: 2,
          resetOnSuccess: true,
        }),
      ),
    );

    // const orderTestSell = [
    //   {
    //     order_id: 57858,
    //     status: 'open',
    //     direction: 'sell',
    //     bidder_addr: 'orai1ejvyzku2upg0q5a6n9nd9cwa29a830hegc488r',
    //     offer_asset: {
    //       info: {
    //         native_token: {
    //           denom: 'orai',
    //         },
    //       },
    //       amount: '1000000',
    //     },
    //     ask_asset: {
    //       info: {
    //         token: {
    //           contract_addr: 'orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh',
    //         },
    //       },
    //       amount: '4000000',
    //     },
    //     filled_offer_amount: '0',
    //     filled_ask_amount: '0',
    //   },
    // ];

    // const orderTestBuy = [
    //   {
    //     order_id: 58139,
    //     status: 'open',
    //     direction: 'buy',
    //     bidder_addr: 'orai1krzyd6jhmvf99x09m8gs5rlj2sfeh4n62wzng9',
    //     offer_asset: {
    //       info: {
    //         token: {
    //           contract_addr: 'orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh',
    //         },
    //       },
    //       amount: '343800000',
    //     },
    //     ask_asset: {
    //       info: {
    //         native_token: {
    //           denom: 'orai',
    //         },
    //       },
    //       amount: '90000000',
    //     },
    //     filled_offer_amount: '0',
    //     filled_ask_amount: '0',
    //   },
    // ];

    // const listSell = transformOrderContract(
    //   orderTestSell as any,
    //   OrderDirectionContract.SELL,
    // );

    // const listBuy = transformOrderContract(
    //   orderTestBuy as any,
    //   OrderDirectionContract.BUY,
    // );

    const listSell = transformOrderContract(
      ordersSell as any,
      OrderDirectionContract.SELL,
    );

    const listBuy = transformOrderContract(
      ordersBuy as any,
      OrderDirectionContract.BUY,
    );

    return {
      ticker_id,
      timestamp: Date.now(),
      bids: listSell,
      ask: listBuy,
    };
  }
}
