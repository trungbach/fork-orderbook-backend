import { createClient, RedisClientType } from 'redis';
import { redisOption } from '../config';

export class Redis {
  private static instance = {};

  public static async getInstance(db?: number): Promise<RedisClientType<any>> {
    if (Redis.instance[db]) {
      return Redis.instance[db];
    }
    Redis.instance[db] = createClient({ url: redisOption.url });
    Redis.instance[db].on('error', (err: any) =>
      console.log('Redis Client Error', err),
    );
    await Redis.instance[db].connect();
    return Redis.instance[db];
  }
}
